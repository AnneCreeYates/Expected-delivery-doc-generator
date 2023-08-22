let selectedFile;
let filteredData = [];
let newCsv;

// Get the file and read it into memory.
document.getElementById("upload_file").addEventListener(
  "change",
  (event) => {
    selectedFile = event.target.files[0];
  },
  false
);

// Pressing the button causes the csv file to be filtered for required information
document.getElementById("upload-file_button").addEventListener(
  "click",
  () => {
    // check if the file is loaded
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = (event) => {
        const csv = event.target.result;
        
        regExpFormating(csv);
       
        let data = newCsv.split("\n").map((row) => row.split(","));
        const columnNames = data[2];    
        const requiredColNames = ["Pre-Advice ID", "Status", "Due Date", "Rec'd Date", "SKU", "SKU Description", "Qty Ord'd", "Qty Rec'd", "Supp ID", "Supplier Name", "Shelf Life ", "Shelf Life \r"]

        filtersData(columnNames, requiredColNames, data);
        filteredDataToBrowser(filteredData);
      };
    }
  },
  false
);


// FUNCTIONS

// function formats the due date format
function formatsDueDate(match, day, month, year) {
  const months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12"
  };
  return `${day}/${months[month]}/${year}`;
}

// the function formats the long date format into a short date format
function formatsLongDate(match, month, day, year) {
  const shortYear = year.slice(-2);
  return `${month}/${day}/${shortYear}`;
}

// function using regular expressions for formating
function regExpFormating(csv){
  // regular expression pattern that defines the numbers in quotes, which need the comma removed 
  const numInQuotes = /"(\d+),(\d+)"/g;
  // regular expression pattern that defines the due date format that needs to be changed to all digits
  const dueDates = /(\d+)-(\w+)-(\d+)/g;
  // regular expression pattern that defines the long date format that needs to be changed to a short date format
  const longDateFormat = /(\d+)\/(\d+)\/(\d+)\s+(\d+):(\d+)/g;

  // newCsv is the csv raw file formated by regular expressions before splitting into rows
  newCsv = csv
  .replaceAll("Compass Services (uk) Limited",  "Compass Services (uk) Ltd")
  .replaceAll("West Country Milk Consortium", "West Country Milk Con.")
  .replaceAll("Matthew Clark Wholesale Ltd", "Matthew Clark Whole Ltd")
  .replace(numInQuotes, "$1$2")
  .replace(dueDates, formatsDueDate)
  .replace(longDateFormat, formatsLongDate);

  return newCsv;
}

// function filters the data from csv file using the requiredColumns to map only the required elements
function filtersData(columnNames, requiredColNames, data) {
  // indexes of the columns that need to be presented
  let requiredColumnIndexes =  columnNames.map((columnName, index) => requiredColNames.includes(columnName) ? index : -1).filter(index => index !== -1); 
  // use the slice method to get the data rows (with the title row)
  let requiredDataRows = data.slice(2);
  // define the index of the column to check for the value "Complete"
  const statusColumnIndex = columnNames.indexOf("Status");
  // the value parameter seems not used in the newRow, but without it the table contents is not printed to the browser
  for (let i = 0; i < requiredDataRows.length; i++) {
    // get the current rtow
    let row = requiredDataRows[i];
    if(row[statusColumnIndex] !== "Complete") {
      let newRow = row.filter((value, index) => requiredColumnIndexes.includes(index));
      filteredData.push(newRow);
    }
  }
}

// function prints the filtered data into the browser
function filteredDataToBrowser(filteredData) {
  // rendering the table
  const table = document.getElementById("loaded_csv_data_table");
  filteredData.forEach((row) => {
    const tableRow = document.createElement("tr");
    row.forEach((content) => {
      const tableData = document.createElement("td");
      tableData.textContent = content;
      tableRow.appendChild(tableData);
    });
    table.appendChild(tableRow);
  });
  generateExcelFile(filteredData);
}

// function that is generating Excel file from the selected data
function generateExcelFile(filteredData) {
  // create a workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Expected Delivery Sheet");

  // Add data to the worksheet
  worksheet.columns = Object.keys(filteredData[0]).map(key => ({header: key, key}));
  worksheet.addRows(filteredData);

  // Write the Excel file
  workbook.xlsx.writeBuffer()
    .then(buffer => {
      const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      saveAs(blob, 'expected-delivery.xlsx');
    });
}
