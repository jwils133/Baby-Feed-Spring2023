package edu.fiu.ffqr.dataloader;


import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import edu.fiu.ffqr.models.NutrientList;
import edu.fiu.ffqr.models.ValidNutrientList;
import edu.fiu.ffqr.service.NutrientListService;


public class ExcelDataLoad {
    
    
	private NutrientListService nutrientService;
	
	public ExcelDataLoad(NutrientListService ftService) {
		this.nutrientService = ftService;
	}
	
	public String dataLoad() {
		int itemsAdded = 0;
        ArrayList<String> validNutrients = new ArrayList<String>();
		
		String resourceName = "FFQRDatabase.xlsx";
		
		try {
			ClassLoader loader = getClass().getClassLoader();
			
            InputStream excelFile = loader.getResourceAsStream(resourceName);
            Workbook workbook = new XSSFWorkbook(excelFile);
            Sheet datatypeSheet = workbook.getSheetAt(0);
            Iterator<Row> iterator = datatypeSheet.iterator();
            
            //get row with nutrient names
            Row nutrientNames = datatypeSheet.getRow(0);
            
            //ignore Food Name and typeID,
            for (int i = 2; i < nutrientNames.getPhysicalNumberOfCells(); i++) {
            	validNutrients.add(nutrientNames.getCell(i).getStringCellValue());
            }
        
             //skip first row, we already dealt with it
             iterator.next();

             while (iterator.hasNext()) {
            	 Row currentRow = iterator.next();
                 Iterator<Cell> cellIterator = currentRow.iterator();                 
                 
                 Cell foodName = cellIterator.next(); //we don't need the food name
                 Cell typeID = cellIterator.next();
                 String nutrientListID = typeID.getStringCellValue();  
                 
                 //check for duplicate 
                 if (nutrientService.getWithNutrientListID(nutrientListID) != null) {
                	 throw new IllegalArgumentException(nutrientListID + " already exists in the nutrientList collection");
                 }
                	 
                	 
                 Map<String, Double> nutrientMap = new HashMap<String, Double>();
                		 
                 while (cellIterator.hasNext()) {
               	 Cell currentCell = cellIterator.next();
                     
	                 if (currentCell.getCellType() == CellType.NUMERIC) {
	                	 //add values to map
	                	 int columnIndex = currentCell.getColumnIndex();
                        /*
                         nutrientMap.put(validNutrients.get(columnIndex -2), currentCell.getNumericCellValue());
                         */
                         nutrientMap.put(ValidNutrientList.validNutrients[columnIndex -2], currentCell.getNumericCellValue());
	                 }
	                 
                }

                //iterate array, if map does not have a value for that nutrient then put a zero for that
                 //nutrient, in the map, before creating the object
                for (int i = 0; i < ValidNutrientList.validNutrients.length; i++) {
                	if (nutrientMap.get(ValidNutrientList.validNutrients[i]) == null) {
                		nutrientMap.put(ValidNutrientList.validNutrients[i], 0.0);
                	}
                }

                NutrientList item = new NutrientList(nutrientListID, nutrientMap);
                
                try {
                	nutrientService.create(item);
                	itemsAdded++;
                }
                catch (Exception e) {
                	e.printStackTrace();
                }

            }        
                       
            System.out.println("A total of " + itemsAdded + " items were added to the nutrient_lists collection");
             
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
		
		return ("A total of " + itemsAdded + " items were added to the nutrient_lists collection");
		
	}
}
	
		
	


