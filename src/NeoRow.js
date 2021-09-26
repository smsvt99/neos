export default function NeoRow(props){
    const { neo } = props;

    function booleanRenderer(bool){
        switch(bool){
            case true: return "yes";
            case false: return "no";
            default: return "???"
        }
    }

    function isHazardousRenderer(bool){
        const className = bool ? "danger" : "";
        return <span className={className}>{booleanRenderer(bool)}</span>
    }

    function diameterRenderer(number){
        return number +  " m"
    }

    function velocityRenderer(number){
        return number + " km/hr"
    }

    function distanceRenderer(number){
        return number + " km"
    }

    return <tr>
        <td>{neo.id}</td>
        <td>{neo.name}</td>
        <td>{diameterRenderer(neo.minDiameter)}</td>
        <td>{diameterRenderer(neo.maxDiameter)}</td>
        <td>{isHazardousRenderer(neo.isHazardous)}</td>
        <td>{booleanRenderer(neo.isSentry)}</td>
        <td>{velocityRenderer(neo.velocity)}</td>
        <td>{distanceRenderer(neo.missDistance)}</td>
        <td>{neo.magnitude}</td>
        <td>{neo.approachDate}</td>
    </tr>
}