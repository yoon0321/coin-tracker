import { useQuery } from 'react-query';
import { fetchCoinHistory } from '../api';
import ApexChart from 'react-apexcharts';

interface ChartProps {
  coinId: string;
}

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(['ohlcv', coinId], () =>
    fetchCoinHistory(coinId)
  );
  return (
    <div>
      {isLoading ? (
        'Loading chart...'
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: 'Price',
              data: data?.map((price) => parseFloat(price.close)) ?? [],
              // No overload matches this call.
              // Overload 1 of 2, '(props: Props | Readonly<Props>): ReactApexChart', gave the following error.
              //   Type '{ name: string; data: number[] | undefined; }' is not assignable to type 'number'.
              // Overload 2 of 2, '(props: Props, context: any): ReactApexChart', gave the following error.
              //   Type '{ name: string; data: number[] | undefined; }' is not assignable to type 'number'.
              // 해당 에러가 났을 경우
              // series data []가 받아야 하는건 number이지만
              // data를 못 받아 올 경우 undefind이기 때문에
              // data?.map((price) => parseFloat(price.close))끝에 ?? []를 붙여줘서
              // 해당 데이터는 number배열이라고 강제하는 것
            },
          ]}
          options={{
            theme: {
              mode: 'dark',
            },
            chart: {
              height: 500,
              width: 500,
              toolbar: {
                show: false,
              },
              background: 'transparent',
            },
            stroke: {
              curve: 'smooth',
              width: 2,
            },
            grid: {
              show: false,
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              axisTicks: {
                show: false,
              },
              axisBorder: {
                show: false,
              },
              labels: {
                show: false,
                datetimeFormatter: {
                  month: 'MMM dd',
                },
              },
              categories: data?.map((price) =>
                new Date(price.time_close * 1000).toUTCString()
              ),
              type: 'datetime',
            },
            fill: {
              type: 'gradient',
              gradient: { gradientToColors: ['blue'], stops: [0, 100] },
            },
            colors: ['green'],
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
