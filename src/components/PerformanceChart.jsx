import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../style/Dashboard/Dashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import { getperformancedata, DayPartingFilterList, heatmapdata } from "../store/dashboard/Action/index";
import { ThreeDots } from 'react-loader-spinner';
import Select from 'react-select';

const PerformanceChart = (props) => {
    const { performancedata, isloading, metricsFilterData } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const metricOptions = metricsFilterData?.map(metric => ({
        label: metric.label,
        value: metric.code,
    }));

    const defaultSelectedMetrics = ["CTR", "CPM", "ROAS"];
    const [selectedMetrics, setSelectedMetrics] = useState(defaultSelectedMetrics);

    // Fetch performance data on mount and when date changes
    useEffect(() => {
        const startDate = props?.date?.startDate || "2024-06-08";
        const endDate = props?.date?.endDate || "2024-07-07";

        const data = { startDate, endDate, metrics: selectedMetrics };
        dispatch(getperformancedata(data));
        dispatch(heatmapdata(data));
        dispatch(DayPartingFilterList({ type: "customizeMetrics" }));
    }, [dispatch, props?.date?.startDate, props?.date?.endDate, selectedMetrics]);

    // Transform the performance data for recharts
    const chartData = performancedata?.categories?.map((category, index) => {
        const dataPoint = { time: category };
        performancedata.series.forEach((series) => {
            dataPoint[series.name] = series.data[index];
        });
        return dataPoint;
    });

    // Handle changes in the multi-select dropdown
    const handleMetricChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedMetrics(selectedValues);
    };

    // Custom tick formatter for the X-axis
    const customTickFormatter = (tick) => {
        const hour = parseInt(tick.split(":")[0], 10);
        return hour % 2 === 0 ? `${hour}Hr` : '';
    };

    return (
        <div className="chart-card">
            <div className="card-header">
                <h2>Performance Chart</h2>
                <div className="metric-dropdown-container">
                    <Select
                        isMulti
                        value={metricOptions.filter(option => selectedMetrics.includes(option.value))}
                        onChange={handleMetricChange}
                        options={metricOptions}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Select Metrics"
                    />
                </div>
            </div>
            <div className="chart-description">Key Metrics for Dayparting Schedule Performance Evaluation</div>
            <div className="chart-content">
                {isloading ? (
                    <div className="loader-container">
                        <ThreeDots 
                            height="80" 
                            width="80" 
                            radius="9"
                            color="#00BFFF" 
                            ariaLabel="three-dots-loading"
                            visible={true}
                        />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="5 5" />
                            <XAxis dataKey="time" tickFormatter={customTickFormatter} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {/* Render lines for selected metrics */}
                            {performancedata?.series
                                ?.filter(series => selectedMetrics.includes(series.name))
                                .map((series, index) => (
                                    <Line
                                        key={index}
                                        type="monotone"
                                        dataKey={series.name}
                                        stroke={getColorByIndex(index)}
                                    />
                                ))}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

// Function to return colors based on the index of the line
const getColorByIndex = (index) => {
    const colors = [
        '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c',
        '#8884a8', '#8dcce9', '#e6739f', '#ff7f00', '#c1d6de',
        '#7fcd85', '#c1b7d3', '#a6d647', '#e6a85e', '#56a5e7'
    ];
    return colors[index % colors.length];  // Cycle through the colors
};

export default PerformanceChart;
