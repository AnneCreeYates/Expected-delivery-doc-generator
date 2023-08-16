let selectedFile;
document.getElementById("upload_file").addEventListener(
  "change",
  (event) => {
    selectedFile = event.target.files[0];
  },
  false
);

document.getElementById("upload-file_button").addEventListener(
  "click",
  () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = (event) => {
        const csv = event.target.result;
        const data = csv.split("\n").map((row) => row.split(","));
        //column names start with the row 3 in the csv file
        const columnNames = data[2];        
        const requiredColNames = ["Pre-Advice ID", "Status", "Due Date", "Rec'd Date", "SKU", "SKU Description", "Qty Ord'd", "Qty Rec'd", "Supp ID", "Supplier Name", "Shelf Life ", "Shelf Life "]
        const dataWithoutFirstTwoRows = data.slice(2);
        
            
        // rendering the table
        const table = document.getElementById("loaded_csv_data_table");
            // create the table using the columnNames data slice
            // print out only the data that is included in the requiredColumns -- includes index

            //CHANGE THAT INTO A SEPAREATE FUNCTION ---
            // indexes of the columns that need to be presented
            let requiredColumnIndexes =  columnNames.map((columnName, index) => requiredColNames.includes(columnName) ? index : -1).filter(index => index !== -1);
            
            // use the slice method to get only the data rows (without the title row)
            let requiredDataRows = dataWithoutFirstTwoRows.slice(1);

            // use the map method to create a new array with only the required columns
            let filteredData = requiredDataRows.map(row => {
              // use the filter method to get oinly the required columns
              let newRow = row.filter((value, index) => requiredColumnIndexes.includes(index));
              return newRow;
            })

            // ---
            
          // this version of the loop prints everything to the browser -- change that into a separate function ----
            filteredData.forEach((row) => {
              const table_row = document.createElement("tr");
              row.forEach((content) => {
                const table_data = document.createElement("td");
                table_data.textContent = content;
                table_row.appendChild(table_data);
              });
              table.appendChild(table_row);
            });
            // ----
      };
    }
  },
  false
);
