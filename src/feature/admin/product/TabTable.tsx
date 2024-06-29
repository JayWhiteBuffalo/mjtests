"use client";
import { Tabs, Tab } from '@nextui-org/react';
import { ProductTable, PendingTable } from '@/feature/admin/product/Table';

export const TabTable = ({ products, canEdit, isEmployee }) => {
  return (
    <div>
    <Tabs>
      <Tab  key="allProducts" title="All Products">
        <ProductTable products={products} canEdit={canEdit} isEmployee={isEmployee} />
      </Tab>
      {!isEmployee && (
        <Tab key="pendingDrafts" title="Pending Drafts">
          <PendingTable pendingProducts={products} canEdit={canEdit} isEmployee={isEmployee} />
        </Tab>
      )}
    </Tabs>
    </div>
  );
};
