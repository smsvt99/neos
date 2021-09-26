import {useState} from 'react';
import { datePickerNow } from './dateUtil';

const opts = {
    eq:   {name: "equals", value: "="},
    neq:  {name: "does not equal", value: "!="},
    con:  {name: "contains", value: "%"},
    ncon: {name: "does not contain", value: "!%"},
    gt:   {name: "greater than", value: ">"},
    gte:  {name: "greater than or equal to", value: ">="},
    lt:   {name: "less than", value: "<"},
    lte:  {name: "less than or equal to", value: "<="},

    at:      {name: "at", value: "="},
    nat:     {name: "not at", value: "!="},
    bef:     {name: "before", value: "<"},
    atOrBef: {name: "at or before", value: "<="},
    aft:     {name: "after", value: ">"},
    atOrAft: {name: "at or after", value:">="}
}

export default function NewFilter(props){

    const {colToFilter, setColToFilter, filters, setFilters} = props;

    let {x,y} = colToFilter;
   
    const [comparator, setComparator] = useState(getInitialComparator());
    const [value, setValue] = useState(getIntialValue());

    function getIntialValue(){
        switch(colToFilter.type){
            case "bool": return "true";
            case "date": return datePickerNow();
            default: return "";
        }
    }

    function getInitialComparator(){
        switch(colToFilter.type){
            case "string": return "%";
            default: return "="
        }
    }

    function onComparatorChange(e){
        setComparator(e.target.value);
    }

    function onValueChange(e){
        setValue(e.target.value);
    }

    function cancel(){
        setColToFilter(null);
    }

    function addFilter(){
        const filtersCopy = JSON.parse(JSON.stringify(filters));
        filtersCopy.push({
            dataIndex: colToFilter.dataIndex,
            type: colToFilter.type,
            value: value,
            comparator: comparator
        })
        setFilters(filtersCopy);
        setColToFilter(null);
    }

    let comparatorOptions = [];
    let valueInput = null;
    switch (colToFilter.type){
        case "bool": {
            comparatorOptions = [opts.eq, opts.neq];
            valueInput = <select value={value} onChange={onValueChange}>
                <option value="true">yes</option>
                <option value="false">no</option>
            </select>
            break;
        }
        case "number": {
            comparatorOptions = [opts.eq, opts.neq, opts.gt, opts.gte, opts.lt, opts.lte];
            valueInput = <input type="number" value={value} onChange={onValueChange}/>
            break;
        }
        case "string": {
            comparatorOptions = [opts.eq, opts.neq, opts.con, opts.ncon]; 
            valueInput = <input type="text" value={value} onChange={onValueChange}/>
            break;
        }
        case "date": {
            comparatorOptions = [opts.at, opts.nat, opts.bef, opts.atOrBef, opts.aft, opts.atOrAft]
            valueInput = <input type="datetime-local" step="60" value={value} onChange={onValueChange}></input>
            break;
        }
        default: alert(`bad type passed: ${colToFilter.type}`)
    }

    function buildStyle(){
        let xProperty = "left";
        y = 80;
        if(x > window.innerWidth/ 2){
            x = window.innerWidth - x;
            xProperty = "right";
        } else {
        }
        return {
            [xProperty]: x,
            top: y
        }
    }

    return <div className="newFilter" style={buildStyle()}>
        <h3>Add Filter: <span className="normal">{colToFilter.text}</span> </h3>
        <select value={comparator} onChange={onComparatorChange}>
            {comparatorOptions.map(opt => <option key={`opt-${opt.value}-${opt.name}`} value={opt.value}>{opt.name}</option>)}
        </select>
        {valueInput}
        <button onClick={addFilter}>Add Filter</button>
        <button onClick={cancel}>Cancel</button>
    </div>

}

