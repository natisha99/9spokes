/**
 * Deletes all data in a sheet and resets dimensions to default.
 * @param sheetName name of the sheet to clear
 */
export function clearSheet(sheetName: string) {
  Excel.run(function(context) {
    var sheetRange = context.workbook.worksheets.getItem(sheetName).getRange();
    sheetRange.clear("All");
    sheetRange.format.columnWidth = 64;
    sheetRange.format.rowHeight = 17;
    return context.sync().then(function() {
      console.log(`${sheetName} Cleared`);
    });
  });
}

/**
 * Sets the demensions of a sheet based on the demensions of the template being used.
 * @param context
 * @param sheet excel worksheet
 * @param template range of the template being used
 * @param itemIndex starting index of columns to be adjusted
 * @param rowHeightSet true if height has already been set, else false
 */
export async function setSheetDimensions(
  context: Excel.RequestContext,
  sheet: Excel.Worksheet,
  template: Excel.Range,
  itemIndex: number,
  rowHeightSet: boolean
) {
  const templateWidth = template.getColumnProperties({ format: { columnWidth: true } });
  const templateHeight = template.getRowProperties({ format: { rowHeight: true } });
  await context.sync();
  let index = itemIndex;
  // Adjusts column widths
  for (const value of templateWidth.value) {
    sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidth = value.format.columnWidth;
    index++;
  }
  // Adjust row height if they have no already been set
  if (!rowHeightSet) {
    let index = 0;
    for (const value of templateHeight.value) {
      sheet.getRangeByIndexes(index, 0, 1, 1).format.rowHeight = value.format.rowHeight;
      index++;
    }
  }
}
