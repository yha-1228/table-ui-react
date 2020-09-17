import React from 'react';
import { Product, Products } from './data';
import TopBar from './TopBar';
import ProductTable from './ProductTable';
import axios from 'axios';

type FilterableProductTableState = {
  error: null | string;
  isLoaded: boolean;
  products: Products;
  filterText: string;
  inStockOnly: boolean;
  checkedAll: { checked: boolean; indeterminate: boolean };
};

class FilterableProductTable extends React.Component<
  {},
  FilterableProductTableState
> {
  url: string;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      products: [],
      filterText: '',
      inStockOnly: false,
      checkedAll: { checked: false, indeterminate: false },
    };
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockOnlyChange = this.handleInStockOnlyChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.toggleCheckedAllChange = this.toggleCheckedAllChange.bind(this);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
    this.url = 'https://5e6736691937020016fed762.mockapi.io/products';
  }

  handleFilterTextChange(filterText: string) {
    this.setState({ filterText: filterText });
  }

  handleInStockOnlyChange(inStockOnly: boolean) {
    this.setState({ inStockOnly: inStockOnly });
  }

  handleDeleteClick() {
    const deleteBy = (id: string) => axios.delete(`${this.url}/${id}`);

    const products = this.state.products.filter((product) => product.checked);
    const ids = products.map((product) => product.id);

    ids.forEach((id) => {
      deleteBy(id).then(() => {
        const products: Products = [...this.state.products].filter(
          (product) => product.id !== id
        );
        this.setState({ products: products });
      });
    });

    this.setState({ checkedAll: { checked: false, indeterminate: false } });
  }

  handleCheckedChange(event: React.ChangeEvent<HTMLInputElement>, id: string) {
    const checked = event.currentTarget.checked;

    const products: Products = [...this.state.products];
    if (!products) return;

    const product = products.find((product) => product.id === id);
    if (!product) return;

    product.checked = checked;

    this.setState({ products: products });

    const noChecked = products.every((product) => product.checked === false);
    const someChecked = products.some((product) => product.checked === true);
    const everyChecked = products.every((product) => product.checked === true);

    if (noChecked) {
      this.setState({ checkedAll: { checked: false, indeterminate: false } });
      return;
    }

    if (someChecked && !everyChecked) {
      this.setState({ checkedAll: { checked: true, indeterminate: true } });
      return;
    }

    if (everyChecked) {
      this.setState({ checkedAll: { checked: true, indeterminate: false } });
      return;
    }
  }

  toggleCheckedAllChange() {
    const products: Products = [...this.state.products];
    if (!products) return;

    const { checked, indeterminate } = this.state.checkedAll;

    if (checked === false && indeterminate === false) {
      products.forEach((product) => {
        product.checked = true;
      });
      this.setState({
        products: products,
        checkedAll: { checked: true, indeterminate: false },
      });
      return;
    }

    if (checked === true && indeterminate === true) {
      products.forEach((product) => {
        product.checked = false;
      });
      this.setState({
        products: products,
        checkedAll: { checked: false, indeterminate: false },
      });
      return;
    }

    if (checked === true && indeterminate === false) {
      products.forEach((product) => {
        product.checked = false;
      });
      this.setState({
        products: products,
        checkedAll: { checked: false, indeterminate: false },
      });
      return;
    }
  }

  componentDidMount() {
    this.loadProducts(this.url);
  }

  loadProducts(url: string) {
    axios
      .get(url)
      .then((result) => {
        const products = result.data.map((product: Product) => ({
          ...product,
          checked: false,
        }));
        this.setState({ isLoaded: true, products: products });
      })
      .catch((result) => {
        this.setState({ isLoaded: true, error: 'Error!' });
        console.log({ ...result.response });
      });
  }

  render() {
    return (
      <div>
        <TopBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          products={this.state.products}
          onFilterTextChange={this.handleFilterTextChange}
          onInStockOnlyChange={this.handleInStockOnlyChange}
          onDeleteClick={this.handleDeleteClick}
        />
        {!this.state.isLoaded ? (
          <div>Loading...</div>
        ) : (
          <ProductTable
            checkedAllindeterminate={this.state.checkedAll.indeterminate}
            checkedAllchecked={this.state.checkedAll.checked}
            filterText={this.state.filterText}
            inStockOnly={this.state.inStockOnly}
            products={this.state.products}
            onCheckedAllChange={this.toggleCheckedAllChange}
            onCheckedChange={this.handleCheckedChange}
          />
        )}
      </div>
    );
  }
}

export default FilterableProductTable;
