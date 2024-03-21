using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Config.Helpers
{
    public interface IPaginatedList : IList
    {
        int CurrentPage { get; }
        int TotalPages { get; }
        int TotalItems { get; }
        bool HasPrevious { get; }
        bool HasNext { get; }
        int StartPage { get; }
        int EndPage { get; }
        int PageSize { get; }
    }

    public class PaginatedList<T> : List<T>, IPaginatedList where T : class
    {
        public PaginatedList(List<T> items, int count, int currentPage, int pageSize)
        {
            CurrentPage = currentPage > 0 ? currentPage : 1;
            PageSize = pageSize;
            TotalItems = count;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);

            int showMaxPages = Configuration.ShowMaxPages;
            if (count <= showMaxPages)
            {
                StartPage = 1;
                EndPage = count;
            }
            else
            {
                StartPage = currentPage;
                EndPage = currentPage + showMaxPages - 1;
            }
            AddRange(items);
        }
        public int CurrentPage { get; private set; }
        public int PageSize { get; private set; }
        public int TotalPages { get; private set; }
        public int TotalItems { get; private set; }
        public int StartPage { get; private set; }
        public int EndPage { get; private set; }
        public bool HasPrevious => CurrentPage > 1;
        public bool HasNext => CurrentPage < TotalPages;

        public static async Task<PaginatedList<T>> CreateAsync(IQueryable<T> source, int currentPage, int pageSize)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PaginatedList<T>(items, count, currentPage, pageSize);
        }
    }

    public static class PaginationExtensions
    {
        public static async Task<PaginatedList<T>> ToPagedList<T>(this IQueryable<T> source, int page = 1, int pageSize = Configuration.PageSize) where T : class
        {
            return await source.ToPagedList<T, T>(s => s, page, pageSize);
        }

        public static async Task<PaginatedList<TResult>> ToPagedList<T, TResult>(this IQueryable<T> source, Func<T, TResult> selectFunc, int page = 1, int pageSize = Configuration.PageSize) where TResult : class where T : class
        {
            int _pageSize = pageSize;
            if (pageSize <= 0)
            {
                _pageSize = Configuration.PageSize;
            }
            else if (pageSize > Configuration.MaxPageSize)
            {
                _pageSize = Configuration.MaxPageSize;
            }
            int skip = (page - 1) * _pageSize;
            var count = await source.CountAsync();
            var items = await source.Skip(skip > 0 ? skip : 0).Take(_pageSize).ToListAsync();

            return new PaginatedList<TResult>(items.Select(selectFunc).ToList(), count, page, _pageSize);
        }
    }
}
