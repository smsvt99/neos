const filterTemplates = {
    "=": function(comparendum, dataIndex, transform){
            return function(row){
                const targetColumn = transform(row[dataIndex]);
                console.log("targetColumn", typeof targetColumn)
                console.log("comparendum", typeof comparendum)
                return targetColumn === comparendum
            }
    },
    "!=": function(comparendum, dataIndex, transform){
            return function(row){
                const targetColumn = transform(row[dataIndex]);
                return targetColumn !== comparendum
            }
    },
    "%": function(comparendum, dataIndex, transform){
            return function(row){
                const targetColumn = transform(row[dataIndex]);
                return targetColumn.includes(comparendum)
            }
    },
    "!%": function(comparendum, dataIndex, transform){
            return function(row){
                const targetColumn = transform(row[dataIndex]);
                return !targetColumn.includes(comparendum)
            }
    },
    ">": function(comparendum, dataIndex, transform){
        return function(row){
            const targetColumn = transform(row[dataIndex]);
            return targetColumn > comparendum;
        }
    },
    ">=": function(comparendum, dataIndex, transform){
        return function(row){
            const targetColumn = transform(row[dataIndex]);
            return targetColumn >= comparendum;
        }
    },
    "<": function(comparendum, dataIndex, transform){
        return function(row){
            const targetColumn = transform(row[dataIndex]);
            return targetColumn < comparendum;
        }
    },
    "<=": function(comparendum, dataIndex, transform){
        return function(row){
            const targetColumn = transform(row[dataIndex]);
            return targetColumn <= comparendum;
        }
    },
}

const sorterTemplates = {
    ASC: function(dataIndex, transform){
        return function(a,b){
            return transform(a[dataIndex]) - transform(b[dataIndex]);
        }
    },
    DESC: function(dataIndex, transform){
        return function(a,b){
            return transform(b[dataIndex]) - transform(a[dataIndex]);
        }
    },
}

const stringSorterTemplates = {
    ASC: function(dataIndex, transform){
        return function(a,b){
            a = transform(a[dataIndex]);
            b = transform(b[dataIndex]);

            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        }
    },
    DESC: function(dataIndex, transform){
        return function(a,b){
            a = transform(a[dataIndex]);
            b = transform(b[dataIndex]);

            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            return 0;
        }
    },
}

const transform = {
    toBool: function(string){
        return string.toLowerCase() === 'true';
    },
    toUpper: function(string){
        return string.toUpperCase();
    },
    noTransform: function(any){
        return any;
    },
    toNumber: function(string){
        return Number(string);
    },
    toDateNumber: function(string){
        return new Date(string).getTime();
    }

}

export function buildFilterCallback(filter){

    const {dataIndex, comparator, value, type} = filter;

    let comparendum;
    let dataIndexTransform = transform.noTransform;

    switch(type){
        case "string": {
            comparendum = transform.toUpper(value)
            dataIndexTransform = transform.toUpper
            break;
        }
        case "bool": {
            comparendum = transform.toBool(value);
            break;
        }
        case "number":{
            comparendum = transform.toNumber(value);
            dataIndexTransform = transform.toNumber;
            break;
        }
        case "date":{
            comparendum = transform.toDateNumber(value);
            dataIndexTransform = transform.toDateNumber;
            break;
        }
        default: console.log('bad type passed to buildFilterCallback: ' + type)
    }

    return filterTemplates[comparator](comparendum, dataIndex, dataIndexTransform);
}

export function buildSorterCallback(sorter){
    const {dataIndex, direction, type} = sorter;
    let dataIndexTransform;
    let templates = sorterTemplates;
    
    switch(type){
        case "string": {
            dataIndexTransform = transform.toUpper
            templates = stringSorterTemplates;
            break;
        }
        case "bool": {
            dataIndexTransform = transform.noTransform;
            break;
        }
        case "number":{
            dataIndexTransform = transform.noTransform;
            break;
        }
        case "date":{
            dataIndexTransform = transform.toDateNumber;
            break;
        }
        default: console.log('bad type passed to buildSorterCallback: ' + type)
    }

    return templates[direction](dataIndex, dataIndexTransform);
}