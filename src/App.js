import { useState, useEffect } from 'react';
import NeoRow from './NeoRow';
import ColHead from './ColHead';
import {getToday, 
        getWeekAgo, 
        isDateRangeValid} from './dateUtil';
import NewFilter from './NewFilter';
import columnDefinitions from './ColumnsDefinitions';
import {buildSorterCallback, buildFilterCallback} from './CallbackBuilder';

function App() {

  const [startDate, setStartDate] = useState(getWeekAgo()); //YYYY-MM-DD, same as date input value
  const [endDate, setEndDate] = useState(getToday()); //YYYY-MM-DD, same as date input value
  const [filters, setFilters] = useState([]); //[{dataIndex: id, type: int, comparator: =, value 12345}, ...]
  const [sorters, setSorters] = useState([])
  const [neos, setNeos] = useState([]); //apply filters/sorters to these...
  const [displayNeos, setDisplayNeos] = useState([]) //to build these
  const [count, setCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0)
  const [colToFilter, setColToFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function callService(){
    setIsLoading(true);
    const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=0gOBH2q4BND9twW9s1E3pxpWZU5LXGJNvlgxilk9`);
    const obj = await res.json();
    
    const parsedNeos = [];
    Object.values(obj.near_earth_objects).flat().forEach(neo => {
      neo.close_approach_data.forEach(cad => {
        parsedNeos.push({
          id: neo.id,
          name: neo.name,
          minDiameter: neo.estimated_diameter.meters.estimated_diameter_min,
          maxDiameter: neo.estimated_diameter.meters.estimated_diameter_max,
          isHazardous: neo.is_potentially_hazardous_asteroid,
          isSentry: neo.is_sentry_object,
          velocity: cad.relative_velocity.kilometers_per_hour,
          missDistance: cad.miss_distance.kilometers,
          magnitude: neo.absolute_magnitude_h,
          approachDate: cad.close_approach_date_full
        })
      })
    })
    setNeos(parsedNeos);
    setCount(parsedNeos.length);
    setIsLoading(false);
  }

  function onStartDateChange(e){
    setStartDate(e.target.value);
  }

  function onEndDateChange(e){
    setEndDate(e.target.value);
  }

  function applyFiltersAndSorters(){
    if(neos.length){
      let neosCopy = JSON.parse(JSON.stringify(neos));
      
      filters.forEach(filter => {
        neosCopy = neosCopy.filter(buildFilterCallback(filter));
      })
      sorters.forEach(sorter =>{
        neosCopy.sort(buildSorterCallback(sorter));
      })

      setDisplayNeos(neosCopy);
      setDisplayCount(neosCopy.length);
    }
    
  }

  useEffect(applyFiltersAndSorters, [filters, sorters, neos]);
  

  return (
    <div className="App">
      <div id="loader" className={isLoading ? "" : "hidden"}/>
      <div id="controls">
        <div>
          <h2>Near Earth Objects Data Viewer</h2>
          <p className="counts">{`showing ${displayCount} of ${count}`}</p>
        </div>
        <div className="flex-row">
          <div>
            <div>
              <label htmlFor="start">Start Date:</label>
              <input name="start" type="date" value={startDate} onChange={onStartDateChange}/>
            </div>
            
            <div>
              <label htmlFor="end">End Date:</label>
              <input name="end" type="date" value={endDate} onChange={onEndDateChange}/>
            </div>
            
            {isDateRangeValid(startDate, endDate) ? null : <span className="danger">{'Date Range must be <= 7 days and >= 0 days'}</span> }
              <button onClick={callService} disabled={isLoading || !isDateRangeValid(startDate, endDate)}>Get Data</button>
          </div>
          <div>
            {colToFilter ? <NewFilter colToFilter={colToFilter} setColToFilter={setColToFilter} filters={filters} setFilters={setFilters}/> : null}
          </div>
        </div>
      </div>
      <table>
         <thead> 
          <tr>
            {columnDefinitions.map(col => <ColHead 
              text = {col.text}
              dataIndex = {col.dataIndex}
              type = {col.type}

              neos = {neos}

              filters = {filters}
              setFilters = {setFilters}
            
              sorters = {sorters}
              setSorters = {setSorters}

              colToFilter = {colToFilter}
              setColToFilter = {setColToFilter}
              key = {`colhead-${col.dataIndex}`}
            />)}
          </tr>
        </thead> 
        <tbody>
          {displayNeos.map((neo, i) => <NeoRow neo={neo} key={`${neo.id}-${i}`} />)}
        </tbody>
      </table>
      <a href="https://icons8.com/icon/3004/filter">Filter icon by Icons8</a>
    </div>
  );
}

export default App;
