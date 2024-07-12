"use client";
import { Tabs, Tab } from '@nextui-org/react';
import { ProductTable, PendingTable, PublishedTable } from '@/feature/admin/product/Table';

export const TabTable = ({ products, canEdit, isEmployee, pendingProducts, publishedProducts }) => {

  const deleteProduct = async (product) => {
    try {
          const response = await fetch(`/api/products/${product.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (response.ok) {
            console.log('Product deleted successfully');
            window.location.reload();
          } else {
            console.error('Failed to delete product');
          }
        } catch (error) {
          console.error('Error deleting product:', error);
        }
    }


  return (
    <div>
    <Tabs>
      <Tab  key="allProducts" title="All Products">
        <ProductTable products={products} canEdit={canEdit} isEmployee={isEmployee} deleteProduct = {deleteProduct} />
      </Tab>
        <Tab key="pendingDrafts" title="Pending Drafts">
          <PendingTable pendingProducts={pendingProducts} canEdit={canEdit} isEmployee={isEmployee} deleteProduct = {deleteProduct}/>
        </Tab>
      <Tab key="publishedProducts" title="Published Products">
        <PublishedTable publishedProducts={publishedProducts} canEdit={canEdit} isEmployee={isEmployee} deleteProduct = {deleteProduct}/>
      </Tab>
    </Tabs>
    </div>
  );
};
