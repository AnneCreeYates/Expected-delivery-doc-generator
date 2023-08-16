let selectedFile;
//for the time being this variable needs to be global, because filteredDataToBrowser needs access to it.
// if I put the filtersData fuinction which returns filteredData withing the filteredDataToBrowser function, it doesn't have the access to columnNames, which is necessary for filtering 
let filteredData = [];

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
        const data = csv.split("\n").map((row) => row.split(","));
        const columnNames = data[2];        
        const requiredColNames = ["Pre-Advice ID", "Status", "Due Date", "Rec'd Date", "SKU", "SKU Description", "Qty Ord'd", "Qty Rec'd", "Supp ID", "Supplier Name", "Shelf Life ", "Shelf Life "]

        filtersData(columnNames, requiredColNames, data);
        filteredDataToBrowser(filteredData);
      };
    }
  },
  false
);


// FUNCTIONS

// function filters the data from csv file using the requiredColumns to map only the required elements
function filtersData(columnNames, requiredColNames, data) {
  // indexes of the columns that need to be presented
  let requiredColumnIndexes =  columnNames.map((columnName, index) => requiredColNames.includes(columnName) ? index : -1).filter(index => index !== -1); 
  // use the slice method to get only the data rows (without the title row)
  let requiredDataRows = data.slice(3);
  // use the map method to create a new array with only the required columns
  filteredData = requiredDataRows.map(row => {
    // use the filter method to get only the required columns
    // the value parameter seems not used in the newRow, but without it the table contents is not printed to the browser
    let newRow = row.filter((value, index) => requiredColumnIndexes.includes(index));
    return newRow;
  })
  return filteredData;
}

// function prints the filtered data into the browser
function filteredDataToBrowser(filteredData) {
  // rendering the table
  const table = document.getElementById("loaded_csv_data_table");
  filteredData.forEach((row) => {
    const table_row = document.createElement("tr");
    row.forEach((content) => {
      const table_data = document.createElement("td");
      table_data.textContent = content;
      table_row.appendChild(table_data);
    });
    table.appendChild(table_row);
  });
}
