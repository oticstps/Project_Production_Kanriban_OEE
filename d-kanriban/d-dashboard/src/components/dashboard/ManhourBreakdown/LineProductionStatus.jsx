import React from 'react';








const lineData = [
  { line: 1, status: 'Running', output: 0, downtime: 0, lastUpdate: '10:30' },
  { line: 2, status: 'Running', output: 0, downtime: 0, lastUpdate: '10:28' },
  { line: 3, status: 'Running', output: 0, downtime: 0, lastUpdate: '09:50' },
  { line: 4, status: 'Running', output: 0, downtime: 0, lastUpdate: '10:31' },
  { line: 5, status: 'Running', output: 0, downtime: 0, lastUpdate: '08:10' },
  { line: 6, status: 'Running', output: 0, downtime: 0, lastUpdate: '10:25' },
  { line: 7, status: 'Running', output: 0, downtime: 0, lastUpdate: '10:32' },
  { line: 8, status: 'Running', output: 0, downtime: 0, lastUpdate: '10:00' },
  { line: 9, status: 'Running', output: 0, downtime: 0, lastUpdate: '10:27' },
  { line: 10, status: 'Running', output: 0, downtime: 0, lastUpdate: '10:33' },
  { line: 11, status: 'Running', output: 0, downtime: 0, lastUpdate: '09:00' },
  { line: 12, status: 'Running', output: 0, downtime: 0, lastUpdate: '10:34' },
];



const statusColor = (status) => {
  switch (status) {
    case 'Running':
      return 'bg-green-100 text-green-700';
    case 'Stop':
      return 'bg-red-100 text-red-700';
    case 'Idle':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return '';
  }
};






const LineProductionStatus = () => {

  return (




    <div className="bg-white p-4 rounded-lg shadow border">


      <h2 className="text-lg font-semibold mb-4">
        Monitoring Status Line Common Rail
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          
          
          
          
          
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Line</th>
              <th className="border px-3 py-2 text-left">Status</th>
              <th className="border px-3 py-2 text-right">Output (pcs)</th>
              <th className="border px-3 py-2 text-right">Downtime (min)</th>
              <th className="border px-3 py-2 text-center">Last Update</th>
            </tr>
          </thead>




          <tbody>




            {lineData.map((item) => (
              

              <tr key={item.line} className="hover:bg-gray-50">
                <td className="border px-3 py-2">
                  CR-{item.line}
                </td>
                <td className="border px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${statusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="border px-3 py-2 text-right">
                  {item.output.toLocaleString()}
                </td>
                <td className="border px-3 py-2 text-right">
                  {item.downtime}
                </td>
                <td className="border px-3 py-2 text-center">
                  {item.lastUpdate}
                </td>
              </tr>


            ))}





          </tbody>


          
        </table>


      </div>


    </div>
  );
};

export default LineProductionStatus;
