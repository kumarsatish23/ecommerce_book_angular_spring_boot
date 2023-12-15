import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe((data: ProductCategory[]) => {
      console.log('Product Categories: ' + JSON.stringify(data));
      this.productCategories = data;
    });
  }

  doSearch(value: string) {
    console.log(`value=${value}`);

    // Split the value at spaces to get an array of keywords
    const keywords = value.split(/\s+/);

    // Create an array of Promises for each keyword query
    const queryPromises = keywords.map(keyword =>
      this.router.navigateByUrl(`/search/${keyword}`)
    );

    // Execute all queries and wait for them to complete
    Promise.all(queryPromises)
      .then(() => console.log('All searches completed successfully'))
      .catch(error => console.error('Error during searches:', error));
  }

}
