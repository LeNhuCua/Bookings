
### Migrations
```sh
dotnet ef migrations add MIGRATION_NAME -s Booking/ -p Data/
dotnet ef migrations remove -s Booking/ -p Data/

dotnet ef database update -s Booking
```
### Run
```sh
dotnet watch -p Booking
```