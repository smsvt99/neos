const columnDefinitions = [
    {
        text: "Id",
        dataIndex: "id",
        type: "number",
      },{
        text: "Name",
        dataIndex: "name",
        type: "string",
      },{
        text: "Min. Diameter",
        dataIndex: "minDiameter",
        type: "number",
      },{
        text: "Max. Diameter",
        dataIndex: "maxDiameter",
        type: "number",
      },{
        text: "Is Hazardous",
        dataIndex: "isHazardous",
        type: "bool",
      },{
        text: "is Sentry",
        dataIndex: "isSentry",
        type: "bool",
      },{
        text: "Velocity",
        dataIndex: "velocity",
        type: "number",
      },{
        text: "Miss Distance",
        dataIndex: "missDistance",
        type: "number",
      },{
        text: "Magnitude",
        dataIndex: "magnitude",
        type: "number",
      },{
        text: "Approach Date",
        dataIndex: "approachDate",
        type: "date",
      },
]

export default columnDefinitions;