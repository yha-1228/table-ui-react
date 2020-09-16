import React, { useState } from 'react';
import classNames from 'classnames';
import { Products, Product } from './data';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';

type ProductTableProps = {
  filterText: string;
  inStockOnly: boolean;
  products: Products;
  onCheckedChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ProductTable({
  filterText,
  inStockOnly,
  products,
  onCheckedChange,
}: ProductTableProps) {
  const isFilterTextValid = (product: Product) => {
    const capsName = product.name.toUpperCase();
    const capsFilterText = filterText.toUpperCase();
    return capsName.indexOf(capsFilterText) !== -1;
  };

  const isInStockOnlyValid = (product: Product) => {
    return inStockOnly ? product.stocked : !undefined;
  };

  const useStyles = makeStyles({
    lh26: { lineHeight: '26px' },
    textMiddleSize: { fontSize: '16px' },
    textDarkgray: { color: 'darkgray' },
  });

  const classes = useStyles();

  const getTableCellStyle = (product: Product) => {
    return classNames(classes.lh26, classes.textMiddleSize, {
      [classes.textDarkgray]: !product.stocked,
    });
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="table-row">
              <TableCell align="center"></TableCell>
              <TableCell align="right">ID</TableCell>
              <TableCell align="left">Brand</TableCell>
              <TableCell align="left">Category</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .filter(isFilterTextValid)
              .filter(isInStockOnlyValid)
              .map((product) => (
                <TableRow key={product.id}>
                  <TableCell
                    className={getTableCellStyle(product)}
                    align="center"
                  >
                    <input
                      type="checkbox"
                      data-id={product.id}
                      checked={product.checked}
                      onChange={onCheckedChange}
                    />
                  </TableCell>
                  <TableCell
                    className={getTableCellStyle(product)}
                    align="right"
                  >
                    {product.id}
                  </TableCell>
                  <TableCell
                    className={getTableCellStyle(product)}
                    align="left"
                  >
                    {product.brand}
                  </TableCell>
                  <TableCell
                    className={getTableCellStyle(product)}
                    align="left"
                  >
                    {product.category}
                  </TableCell>
                  <TableCell
                    className={getTableCellStyle(product)}
                    align="left"
                  >
                    {product.name}
                  </TableCell>
                  <TableCell
                    className={getTableCellStyle(product)}
                    align="right"
                  >
                    {product.price}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
