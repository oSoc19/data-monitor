# Backend API

## GET calls

### Bridge Openings

```
/api/bridge_openings/?id=1&startTime=something&endTime=later
```
This api call will send you all the bridge openings for the bridge that have the id specified. It is also possible to add an endTime and a startTime to the call, but it is optional.
___

```
/api/qa/bridge_openings/summary/
```
This call will send you a summary of all the provinces of the Netherlands
___
```
/api/qa/bridge_openings/summary/provinces/:province
```
This call will send you a summary of all the cities of the specified province.
___
```
/api/qa/bridge_openings/summary/cities/:city
```
This call will send you details on the bridge openings in the specified city.
___
```
/api/download/bridge_openings/summary/
```
CSV export for the whole Netherlands
___
```
/api/download/bridge_openings/summary/provinces/:province
```
CSV export for the specified province
___
```
/api/download/bridge_openings/summary/cities/:city
```
CSV export for the specified city
___

### Maintenance works

```
/api/maintenance_works/?startTime=something&endTime=later
```
Send all the maintenance works data in geoJSON between the optional parameters startTime and endTime
___
```
/api/maintenance_works/:id
```
Send details on a the particular event that has the id specified.
___
```
/api/qa/maintenance_works/summary/
```
This call will send you a summary of all the provinces of the Netherlands
___
```
/api/qa/maintenance_works/summary/provinces/:province
```
This call will send you a summary of all the cities of the specified province.
___
```
/api/qa/maintenance_works/summary/cities/:city
```
This call will send you details on the maintenance works in the specified city.
___

### Accidents

```
/api/accidents/:id
```
Send details on a the particular event that has the id specified.
___
```
/api/accidents/?startTime=now&endTime=later
```
This api call will send you all the accidents. It is also possible to add an endTime and a startTime to the call, but it is optional.
___
```
/api/qa/accidents/summary/
```
This call will send you a summary of all the provinces of the Netherlands
___
```
/api/qa/accidents/summary/provinces/:province
```
This call will send you a summary of all the cities of the specified province.
___
```
/api/qa/accidents/summary/cities/:city
```
This call will send you details on the accidents in the specified city.
___
```
/api/download/accidents/summary/
```
CSV export for the whole Netherlands
___
```
/api/download/accidents/summary/provinces/:province
```
CSV export for the specified province
___
```
/api/download/accidents/summary/cities/:city
```
CSV export for the specified city
___
## PUT calls

```
/api/qa/bridge_openings/:id
```
Allow to manually modified something with the following body:
```
{
  manualIntervention: req.body.manualIntervention,
  comment: req.body.comment
}
```