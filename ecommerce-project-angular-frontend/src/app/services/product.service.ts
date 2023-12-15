import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(thePage: number,
                         thePageSize: number, 
                         theCategoryId: number): Observable<GetResponseProducts> {

    // Build url based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    // Call Backend REST API with Pagination
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
  
  getTheProduct(theProductId: number): Observable<Product> {
    
    // Get the URL based on Route: 'products/:id'
    const productUrl = `${this.baseUrl}/${theProductId}`

    return this.httpClient.get<Product>(productUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]> {

    // Build url based on category id ... backend REST Api
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    // Call Backend REST API
    return this.getProducts(searchUrl);
  }

  SearchProducts(theKeyWord: string): Observable<Product[]> {

    // Build URL baed on the keyword
    const searchUrlByKeyword = `${this.baseUrl}/search/`;

    // Call Backend REST API
    return this.getProducts(searchUrlByKeyword);
  }

  searchProducPaginate(thePage: number,
                       thePageSize: number, 
                       theKeyWord: string): Observable<GetResponseProducts> {

    // Build url based on search term (theKeyWord), page number and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`
                    + `&page=${thePage}&size=${thePageSize}`;

    // Call Backend REST API with Pagination
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
  
  getProducts(searchUrl: string): Observable<Product[]> {

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
    
  }

  getProductCategories(): Observable<ProductCategory[]> {
    
    // Call Backend REST API
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  "page": {
    "size": number,
    "totalElements": number,
    "totalPages": number,
    "number": number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
