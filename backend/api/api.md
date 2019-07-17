# Backend API

## GET calls

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
This call will send you details on the specified city.
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