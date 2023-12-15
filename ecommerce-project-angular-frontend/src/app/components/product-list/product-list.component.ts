import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName = "";
  serachMode: boolean = false;

  // Properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyWord: string = "";

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => this.listProducts());

  }

  listProducts() {

    this.serachMode = this.route.snapshot.paramMap.has('keyword');
    //console.log(`searchMode=${this.serachMode}`);

    if (this.serachMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {

    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword')!;

    /**
     * If we have a different keyword than previous
     * then set thePageNumber to 1.
     */
    if (this.previousKeyWord != theKeyWord) {
      this.thePageNumber = 1;
    }

    this.previousKeyWord = theKeyWord;

    console.log(`keyword=${theKeyWord}, thePageNumber=${this.thePageNumber}`);

    // Search for products using the keyword with pagination
    this.productService.searchProducPaginate(this.thePageNumber - 1,
      this.thePageSize,
      theKeyWord).subscribe(this.processResult());
  }

  handleListProducts() {

    // Check if parameter 'id' is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    // Get the 'id' param which is a string, and convert it to a nummber, using the "+" symbol
    // Make use of the NON-NULL Assertion Operator "!"
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      // Get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else {
      // default to category id 1 and category name to 'Books'
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    /**
     * Check if we have a difenet category than previous.
     * Note: Angular will reuse the Component if it is currently viewed.
     * 
     * If we have a different category id than previous, then set thePageNumber back to 1.
     */
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    // Get the products for the given category id
    //this.productService.getProductList(this.currentCategoryId).subscribe(data => this.products = data);
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(theProduct: Product) {

    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    // Create a new cartItem based on the product, and send it to cartService
    const theCartItem: CartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

}
