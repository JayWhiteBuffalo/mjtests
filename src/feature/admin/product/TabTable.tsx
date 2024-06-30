"use client";
import { Tabs, Tab } from '@nextui-org/react';
import { ProductTable, PendingTable, PublishedTable } from '@/feature/admin/product/Table';

export const TabTable = ({ products, canEdit, isEmployee, pendingProducts, publishedProducts }) => {
  return (
    <div>
    <Tabs>
      <Tab  key="allProducts" title="All Products">
        <ProductTable products={products} canEdit={canEdit} isEmployee={isEmployee} />
      </Tab>
        <Tab key="pendingDrafts" title="Pending Drafts">
          <PendingTable pendingProducts={pendingProducts} canEdit={canEdit} isEmployee={isEmployee} />
        </Tab>
      <Tab key="publishedProducts" title="Published Products">
        <PublishedTable publishedProducts={publishedProducts} canEdit={canEdit} isEmployee={isEmployee}/>
      </Tab>
    </Tabs>
    </div>
  );
};
