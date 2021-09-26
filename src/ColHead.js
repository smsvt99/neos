import { useState } from 'react';

export default function ColHead(props){
    
    const [showButtons, setShowButtons] = useState(false);

    const currentSorter = props.sorters.find(sorter => sorter.dataIndex === props.dataIndex)
    
    const filters = [];
    props.filters.forEach((obj, i) => {
        if(obj.dataIndex === props.dataIndex){
            filters.push({
                index: i,
                ...obj
            })
        }
    });

    function handleMouseEnter(){
        setShowButtons(true)
    }
    function handleMouseLeave(){
        setShowButtons(false)
    }

    function addFilter(e){
        if(props.neos.length === 0) return;
        props.setColToFilter({
            text: props.text,
            type: props.type,
            dataIndex: props.dataIndex,
            x: e.clientX,
            y: e.clientY
        })
    }

    function cycleSorter(){
        if(props.neos.length === 0) return;
        // none -> asc -> desc -> none
        let sortersCopy = JSON.parse(JSON.stringify(props.sorters));
        if(!currentSorter){
            sortersCopy.push({
                dataIndex: props.dataIndex,
                direction: 'ASC',
                type: props.type
            });
        } else if (currentSorter.direction === "ASC"){
            sortersCopy = sortersCopy.filter(sorter => sorter.dataIndex !== props.dataIndex);
            sortersCopy.push({
                dataIndex: props.dataIndex,
                direction: 'DESC',
                type: props.type
            });

        } else {
            sortersCopy = sortersCopy.filter(sorter => sorter.dataIndex !== props.dataIndex);
        }
        props.setSorters(sortersCopy);
    }

    function getSorterButton(){
        if (!currentSorter) return <span>↑↓</span>
        if(currentSorter.direction === "ASC") return <span>↑↑</span>
        if(currentSorter.direction === "DESC") return <span>↓↓</span>
    }


    const editing = props.colToFilter && props.colToFilter.dataIndex === props.dataIndex;

    return <th onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className = {editing ? "settingFilter" : ""}>
        {props.text}
        <div className="buttons">
            <img alt="filter icon" className={ showButtons || editing ? "" : "hidden"}  onClick={addFilter} src="https://img.icons8.com/ios/20/000000/filter--v1.png"/>
            <div className={showButtons || editing || currentSorter ? "sortButton" : "hidden sortButton"} onClick={cycleSorter}>
                {getSorterButton()}
            </div>
        </div>
        {filters.map(filter => <Filter filter={filter} filters={props.filters} setFilters={props.setFilters} key={`${filter.dataIndex}-${filter.comparator}-${filter.value}}`}/>)}
    </th>
}

function Filter(props){

    function remove(){
        const filtersCopy = JSON.parse(JSON.stringify(props.filters));
        filtersCopy.splice(props.filter.index, 1);
        props.setFilters(filtersCopy);
    }

    return <div onClick={remove} className="filter">
        <span className="danger">✖</span>
        {/* <div> */}
            <span>{props.filter.comparator}</span>
            <span>{props.filter.value}</span>
        {/* </div> */}
    </div>
}