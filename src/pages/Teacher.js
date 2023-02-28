import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import moment from 'moment';

function formatDuration(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

function DataTable({ startTime, qrData }) { const maxTimestamps = Math.max(...qrData.map((item) => item.timestamps.length));

  return (
    <table>
      <thead>
        <tr>
          <th>Name/Id</th>
          {[...Array(maxTimestamps)].map((_, index) => (
            <th key={index}>Timestamp {index + 1}</th>
          ))}
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {qrData.map((item, index) => (
          <tr key={index}>
            <td>{item.qrData}</td>
            {[...Array(maxTimestamps)].map((_, index) => (
              <td key={index}>{item.timestamps[index] ? formatDuration(item.timestamps[index] - item.timestamps[index - 1] ? item.timestamps[index - 1] : startTime) : ""}</td>
            ))}
            <td>{formatDuration(item.timestamps[item.timestamps.length - 1] - startTime)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Teacher() {
  const [showScanner, setShowScanner] = useState(false);
  const [qrData, setQrData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [startTime, setStartTime] = useState();

  const handleScan = (data) => {
    if (data) {
      const qrItem = qrData.find(item => item.qrData === data);
      if (qrItem) {
        qrItem.timestamps.push(moment().format('MMMM Do YYYY, h:mm:ss a'));
        setQrData([...qrData]);
      } else {
        setQrData([...qrData, { qrData: data, timestamps: [new Date()]}]);
      }
    }
  };

  const handleError = (error) => {
    setErrorMessage(error.message);
  };

  const startScan = () => {
    setStartTime(new Date());
    setShowScanner(true);
  };

  const stopScan = () => {
    setShowScanner(false);
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Get the maximum number of timestamps
    const maxTimestamps = Math.max(...qrData.map((item) => item.timestamps.length));
    
    // Add table header row to CSV
    let headerRow = ["QR Code Data"];
    for (let i = 0; i < maxTimestamps; i++) {
      headerRow.push(`Timestamp ${i + 1}`);
    }
    csvContent += headerRow.join(",") + "\r\n";
    
    // Add table body rows to CSV
    qrData.forEach((item) => {
      let row = [item.qrData];
      for (let i = 0; i < maxTimestamps; i++) {
        const timestamp = item.timestamps[i] || ""; // Append empty string for missing timestamps
        row.push(timestamp);
      }
      csvContent += row.join(",") + "\r\n";
    });
    
    // Create a link and click it to trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "qrData.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
  }


  return (
    <div className="App">
      {!showScanner && (
        <button onClick={startScan}>Start</button>
      )}
      {showScanner && (
        <div>
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
          <button onClick={stopScan}>Stop</button>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
      )}
      {qrData.length > 0 && (
        <>
        <DataTable startTime={startTime} qrData={qrData}/>
        <button onClick={stopScan}>Download CSV</button>
        </>
      )}
    </div>
  );
};

export default Teacher;
