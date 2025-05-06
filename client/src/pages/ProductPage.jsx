import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import Pagination from '../components/Pagination';
import SearchFeature from '../components/SearchFeature';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const ProductPage = () => {
  const [productList, setProductList] = useState([]); // Store all products
  const [filteredProducts, setFilteredProducts] = useState([]); // Store filtered products
  const [defaultOptions, setDefaultOptions] = useState([]); // Default categories
  const [selectedSort, setSelectedSort] = useState(null); // Track current sort option
  const [loading, setLoading] = useState(true); // Loading state

  //////////////////////////////////////////////////////////////
  // Fetch API
  //////////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/.netlify/functions/getAllProducts');

        // set all states to have all product list
        setProductList(data);
        setFilteredProducts(data);

        // Extract unique categories for React-Select
        const createUniqueCategories = [
          ...new Set(data.map((product) => product.category)),
        ].map((category) => ({
          label: category
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase()),
          value: category,
        }));
        setDefaultOptions(createUniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchData();
  }, []);
  console.log(productList);

  /////////////////////////////////////////////////////////////////////////
  // Filter Feature
  /////////////////////////////////////////////////////////////////////////

  // Using React-Select, filter options based on search value
  const loadOptions = (searchValue, callback) => {
    const filteredOptions = defaultOptions.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
    callback(filteredOptions);
  };

  const handleSelectChange = useCallback(
    (selectedOptions) => {
      if (!selectedOptions || selectedOptions.length === 0) {
        setFilteredProducts(productList);
        return;
      }

      const filtered = productList.filter((product) =>
        selectedOptions.some((option) => option.value === product.category)
      );
      setFilteredProducts(filtered);
    },
    [productList]
  );

  /////////////////////////////////////////////////////////////////////////
  // SORT Feature
  /////////////////////////////////////////////////////////////////////////

  const sortOptions = [
    { value: 'name-a-z', label: 'Name: A-Z' },
    { value: 'name-z-a', label: 'Name: Z-A' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: '', label: 'None' },
  ];

  const handleSortChange = useCallback((selectedOption) => {
    const sortValue = selectedOption ? selectedOption.value : null;
    setSelectedSort(sortValue);
  }, []);

  const sortedProducts = useMemo(() => {
    let sortedList = [...filteredProducts]; // use filteredProducts as initial data

    if (selectedSort === 'name-a-z') {
      sortedList.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSort === 'name-z-a') {
      sortedList.sort((a, b) => b.title.localeCompare(a.title));
    } else if (selectedSort === 'price-high') {
      sortedList.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'price-low') {
      sortedList.sort((a, b) => a.price - b.price);
    }

    return sortedList;
  }, [selectedSort, filteredProducts]);

  // /////////////////////////////////////////////////////////////////////
  // Pagination Feature
  ///////////////////////////////////////////////////////////////////////
  const [page, setPage] = useState(1); // Pagination state
  const itemsPerPage = 20; // Items per page
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage); // Calculate total pages

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  }, [page, sortedProducts]);

  /////////////////////////////////////////////////////////////////////////
  // RENDER the app
  /////////////////////////////////////////////////////////////////////////

  return (
    <>
      <Header />
      <div className="mt-20 grid grid-cols-1 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          <SearchFeature
            setFilteredProducts={setFilteredProducts}
            sortedProducts={sortedProducts}
            productList={productList}
          />
        </div>

        <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-center items-center gap-4">
          <div className="flex justify-center z-20">
            <AsyncSelect
              loadOptions={loadOptions}
              isMulti
              defaultOptions={defaultOptions}
              onChange={handleSelectChange}
              className="w-45 sm:w-55 md:w-60 lg:w-70 xl:w-75"
              placeholder="Filter"
            />
          </div>

          <div className="flex justify-center z-20">
            <Select
              options={sortOptions}
              className="w-45 sm:w-55 md:w-60 lg:w-70 xl:w-75"
              onChange={handleSortChange}
              placeholder="Sort"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          <p className="ml-4 text-lg">Loading products...</p>
        </div>
      ) : (
        <ProductCard productList={paginatedProducts} />
      )}

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      <Footer />
    </>
  );
};

export default ProductPage;

/*
How it works
1. Fetch the API and store it to Product List and Filtered Product
 * Product List ALWAYS have the default product list
 * Filtered Product will be updated

2. On the Filter Feature, if no filter, display all products
   If it has a filter, use setFilteredProducts to the created variable, filtered

3. On the Sort Feature, filtered product is the default value
   If sort is not used, display the filtered product; if no filtered product, display original list
   If sort is used, display the new sortedProducts variable

4. SortedProducts variable will be used on the pagination feature, and store it on a PaginatedProduct variable
   Because i want to access all the products on all pages. If i sort or filter, all products on all pages will be included
   That's why there is a function to handle the pagination feature, instead of just doing it on the API side.
   Not sure how it works yet

5. the PaginatedProduct variable is the props on the ProductPage component

Why?
So all features are handled. Here is the sequence
Default list > FilteredList > SortedProducts > PaginatedProducts


LIMITATIONS:
Currently, filtering and sorting are being handled on the frontend.
There are no API calls to fetch filtered or sorted data, and pagination is also handled on the frontend.
This is not ideal for large datasets as it can lead to performance issues.
Server side pagination, filtering, and sorting are recommended for better performance.

If you want to implement this, you need to create a new API endpoint that accepts query parameters for filtering and sorting and pagination.
And stop using the packages react-select and async-select.
*/
