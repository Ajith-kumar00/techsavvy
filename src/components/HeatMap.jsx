import React, { useEffect } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const DataTable = () => {
  const { heatmaploading, heatmapdata } = useSelector((state) => state.dashboard);

  useEffect(() => {
    console.log('heatmapdata:', heatmapdata);
  }, [heatmapdata]);

  if (heatmaploading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!heatmapdata || !heatmapdata.result?.length) {
    return <div>No data available.</div>;
  }

  const { result, rangeDetails } = heatmapdata;
  const metrics = Object.keys(result[0]?.Hourly_Data[0] || {}).filter((key) => key !== 'time_part' && key !== 'show');
  const hours = result[0]?.Hourly_Data.map((hour) => hour?.time_part?.slice(0, 5)) || [];

  const getColor = (value, min, max, baseColor = '#e2d9fa') => {
    const ratio = (value - min) / (max - min || 1); // Avoid division by zero
    const intensity = Math.min(Math.max(ratio * 255, 0), 255);
    return `rgba(${parseInt(baseColor.slice(1, 3), 16)}, ${parseInt(baseColor.slice(3, 5), 16)}, ${parseInt(baseColor.slice(5, 7), 16)}, ${0.3 + ratio * 0.7})`;
  };

  const generateRows = () => (
    hours.map((hour, hourIndex) => (
      <tr key={hourIndex}>
        <td>{hour}</td>
        {result.map((day, dayIndex) => (
          metrics.map((metric) => (
            <td
              key={`${dayIndex}-${metric}`}
              style={{
                backgroundColor: getColor(
                  day?.Hourly_Data[hourIndex][metric],
                  rangeDetails[metric]?.min || 0,
                  rangeDetails[metric]?.max || 100
                ),
              }}
            >
              {day?.Hourly_Data[hourIndex][metric]?.toFixed(2)}
            </td>
          ))
        ))}
      </tr>
    ))
  );

  const generateFooter = () => (
    <tr>
      <td>Total</td>
      {result.map((day, dayIndex) => (
        metrics.map((metric) => (
          <td key={`${dayIndex}-total-${metric}`}>
            {day?.Hourly_Data.reduce((acc, hour) => acc + (hour[metric] || 0), 0).toFixed(2)}
          </td>
        ))
      ))}
    </tr>
  );

  return (
    <div className="mt-5">
      <h4>Heat Map</h4>
      <h5>Select Hour to Schedule Dayparting</h5>
      <Table bordered hover responsive="sm">
        <thead>
          <tr>
            <th>Time</th>
            {result.map((day, index) => (
              <th colSpan={metrics.length} key={index}>{day?.weekday}</th>
            ))}
          </tr>
          <tr>
            <th></th>
            {metrics.map((metric) => (
              result.map((_, index) => (
                <th key={`${index}-${metric}`}>{metric}</th>
              ))
            ))}
          </tr>
        </thead>
        <tbody>{generateRows()}</tbody>
        <tfoot>{generateFooter()}</tfoot>
      </Table>
    </div>
  );
};

export default DataTable;
