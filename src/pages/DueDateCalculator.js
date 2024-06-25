import { useState, useEffect } from 'react';
import moment from 'moment';
import { Web5 } from '@web5/api';

const DueDateCalculator = () => {
  const [method, setMethod] = useState('lastPeriod');
  const [date, setDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [result, setResult] = useState(null);
  const [web5, setWeb5] = useState(null);
  const [userDid, setUserDid] = useState(null);

  useEffect(() => {
    const connectWeb5 = async () => {
      const { web5, did: userDid } = await Web5.connect({});
      setWeb5(web5);
      setUserDid(userDid);
    };

    connectWeb5();
  }, []);

  const storePregnancyDataInDWN = async (dueDate, weeks, trimester) => {
    if (!web5 || !userDid) return;

    const pregnancyData = {
      dueDate: dueDate.toString(),
      weeks,
      trimester,
    };

   const {record} =  await web5.dwn.records.create({
      did: userDid,
      data: {
        content: JSON.stringify(pregnancyData),
        description: "Pregnancy Due Date Information",
      },
      message: {
        dataFormat: 'application/json',
      },
    });
    console.log('Pregnancy data stored in DWN', await record.data.text(), await record)
  };


  const calculateDueDate = () => {
    let dueDate;
    if (method === 'lastPeriod') {
      dueDate = moment(date).add(cycleLength - 28, 'days').add(280, 'days');
    } else if (method === 'conception') {
      dueDate = moment(date).add(266, 'days');
    } else if (method === 'dueDate') {
      dueDate = moment(date);
    }

    const weeksPregnant = moment().diff(dueDate.subtract(280, 'days'), 'weeks');
    const trimester = weeksPregnant < 13 ? 1 : weeksPregnant < 28 ? 2 : 3;

    setResult({
      dueDate: dueDate.format('MMMM Do YYYY'),
      weeksPregnant,
      trimester,
    });

    storePregnancyDataInDWN(dueDate, weeksPregnant, trimester);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Pregnancy Calculator</h1>
        <div className="mb-4">
          <label className="block text-gray-700">Calculation Method</label>
          <select
            className="mt-1 block w-full"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="lastPeriod">Last Period</option>
            <option value="conception">Conception</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            className="mt-1 block w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        {method === 'lastPeriod' && (
          <div className="mb-4">
            <label className="block text-gray-700">Cycle Length (days)</label>
            <input
              type="number"
              className="mt-1 block w-full"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
            />
          </div>
        )}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={calculateDueDate}
        >
          Calculate
        </button>
        {result && (
          <div className="mt-4 p-4 bg-gray-200 rounded">
            <p><strong>Due Date:</strong> {result.dueDate}</p>
            <p><strong>Weeks Pregnant:</strong> {result.weeksPregnant}</p>
            <p><strong>Trimester:</strong> {result.trimester}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DueDateCalculator;
