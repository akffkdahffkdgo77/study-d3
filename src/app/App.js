import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import BaseLayout from 'layout/BaseLayout';

import AreaChartDemo from 'pages/AreaChartDemo';
import BarChartDemo from 'pages/BarChartDemo';
import BubbleChartDemo from 'pages/BubbleChartDemo';
import DonutChartDemo from 'pages/DonutChartDemo';
import GradientDonutChartDemo from 'pages/GradientDonutChartDemo';
import GroupedBarChartDemo from 'pages/GroupedBarChartDemo';
import LineChartDemo from 'pages/LineChartDemo';
import MultiLineChartDemo from 'pages/MultiLineChartDemo';
import StackedBarChartDemo from 'pages/StackedBarChartDemo';
import ScatterLineChartDemo from 'pages/ScatterLineChartDemo';

function App() {
    return (
        <RouterProvider
            router={createBrowserRouter([
                {
                    path: '',
                    element: <BaseLayout />,
                    children: [
                        {
                            path: '',
                            element: <AreaChartDemo />
                        },
                        {
                            path: 'area',
                            element: <AreaChartDemo />
                        },
                        {
                            path: 'bar',
                            element: <BarChartDemo />
                        },
                        {
                            path: 'bubble',
                            element: <BubbleChartDemo />
                        },
                        {
                            path: 'donut',
                            element: <DonutChartDemo />
                        },
                        {
                            path: 'gradient-donut',
                            element: <GradientDonutChartDemo />
                        },
                        {
                            path: 'grouped-bar',
                            element: <GroupedBarChartDemo />
                        },
                        {
                            path: 'line',
                            element: <LineChartDemo />
                        },
                        {
                            path: 'multi-line',
                            element: <MultiLineChartDemo />
                        },
                        {
                            path: 'scatter-line',
                            element: <ScatterLineChartDemo />
                        },
                        {
                            path: 'stacked-bar',
                            element: <StackedBarChartDemo />
                        }
                    ]
                }
            ])}
        />
    );
}

export default App;
