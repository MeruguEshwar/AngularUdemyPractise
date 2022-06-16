import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@app/shared/models/api-response.model';
import { Category } from '@app/shared/models/documentcategory.model';



@Injectable({
    providedIn:'root'
})
export class CategoryService
{
    constructor(private http:HttpClient){

    }
    getAllDocumentCategory(status:number){
        return this.http.get<ApiResponse<Category>>(`api/document/categories?status=${status}`);
    }
    getDocumentCategory(documentCategoryDetailsId:string){
        return this.http.get<ApiResponse<Category>>(`api/document/category/${documentCategoryDetailsId}`);
    }
    addDocumentCategory(category:any){
         
        return this.http.post<ApiResponse<Category>>(`api/document/category/add`,category);
    }
    updateDocumentCategory(category:Category){
        return this.http.post<ApiResponse<Category>>('api/document/category/update',category)
    }
    activateDocumentCategory(documentCategoryDetailsId:number){
        return this.http.put<ApiResponse<Category>>(`api/document/category/activate/${documentCategoryDetailsId}`,{})
    }
    deactivateDocumentCategory(documentCategoryDetailsId:number){
        return this.http.put<ApiResponse<Category>>(`api/document/category/deactivate/${documentCategoryDetailsId}`,{})
    }
    isDocumentCategoryExists(documentCategory:string){
        return this.http.get<ApiResponse<Category>>(`api/document/category/exists?documentCategory=${documentCategory}`)
    }
}