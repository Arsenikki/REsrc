import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic';
import _ from 'lodash';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
const fetcher = (url) => fetch(url).then((res) => res.json())

const Home = () => {
  // const { data: resourceMetrics } = useSwr('/api/getRandomNumber', fetcher)
  const [refreshDelay, setRefreshDelay] = useState(2000);
  const [cpuSeries, setCpuSeries] = useState([{ data: [] }]);
  const [memorySeries, setMemorySeries] = useState([{ data: [] }]);
  const [absoluteMemorySeries, setAbsMemorySeries] = useState([{ data: [] }]);
  const [currentProcessList, setCurrentProcessList] = useState([
    {
      pid: 666,
      name: 'test'
    }
  ]);
  const [time, setTime] = useState(0);

  const [options, setOptions] = useState({
    chart: {
      id: 'realtime',
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    title: {
      text: 'Dynamic Updating Chart',
      align: 'middle'
    },
    markers: {
      size: 4
    },
    xaxis: {
      type: 'numeric',
      range: 10,
    },
  });

  const updateResourceMetrics = async () => {
    const res = await fetch('/api/getProcessMetrics');
    const data = await res.json();
    storeResourceMetrics(data);
  };

  const storeResourceMetrics = (data) => {
    console.log('time', time);
    console.log('node cpu usage: ', data.value[0]);
    setCpuSeries([{ data: [...cpuSeries[0].data, [time, data.value[0].cpu.toFixed(1)]] }]);
    setMemorySeries([{ data: [...memorySeries[0].data, [time, data.value[0].mem.usage.toFixed(1)]].slice() }]);
    updateProcessList(data.value);
    setTime(time + 1);
    console.log("here:", currentProcessList);
  }

  const updateProcessList = (processList) => {
    let processPidList = processList.map(process => {
      return (
        { name: process.name, pid: process.pid }
      )
    });
    let top10Processes = getTop10Processes(processPidList);
    setCurrentProcessList(top10Processes);
  };

  const getTop10Processes = (processPidList) => {
    let sorted = _.sortBy(processPidList, 'cpu');
    return sorted.reverse().splice(0, 10);
  }

  useInterval(() => {
    updateResourceMetrics();
  }, refreshDelay);

  return (
    <div className={styles.container}>
      <Head>
        <title>REsrc - resource monitor</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.title}>
        REsrc
      </h1>
      <main className={styles.main}>
        <div className={styles.card}>
          currentProcessList
          <table>
          {currentProcessList.map(process => 
            { return (
                <tbody>
                  <tr id={process.pid}>
                    <td id="name">{process.name}</td>
                    <td id="pid">{process.pid}</td>
                  </tr>
                </tbody>
            )})}
            </table>
        </div>
        {time === 0 ? <p>Loading...</p> :
          <div className={styles.grid}>
            <div className="app" className={styles.card}>
              <div className="row">
                <div className="CPU">
                  <ApexCharts
                    options={options}
                    series={cpuSeries}
                    labels={["CPU"]}
                    type="line"
                    width={'500'}
                    height={'300'}
                  />
                </div>
              </div>
            </div>
            <div className="app" className={styles.card}>
              <div className="row">
                <div className="Memory">
                  <ApexCharts
                    options={options}
                    series={memorySeries}
                    labels={["Memory"]}
                    type="line"
                    width={'500'}
                    height={'300'}
                  />
                </div>
              </div>
            </div>
          </div>
        }
      </main>
    </div>
  )
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default Home;