import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';
import Product from './Product';
import Spinner from '../spinner/spinner';
import { baseUrl } from '../../adapter/api';

// styles
const Head = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0px;
  border-bottom: 1px solid #99999f;
  margin-bottom: 10px;
  span {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    h3 {
      font-size: 24px;
      margin-right: 10px;
    }
    p {
      background: red;
      color: #ffff;
      font-size: 16px;
      padding: 10px;
      border-radius: 5px;
    }
  }
  button {
    background: red;
    color: #ffff;
    font-size: 16px;
    padding: 10px;
    border-radius: 5px;

    border: none;
    cursor: pointer;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
  }
`;



const StyledArrowContainerRight = styled.div`
  font-size: 35px;
  width: 50px;
  height: 50px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
  background: #ffff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  border-radius: 50%;
  right: 0;
  :hover {
    background: gray;
    color: #ffff;
  }
  cursor: pointer;
  z-index: 1;
  @media only screen and (max-width: 550px) {
    display: none;
  }
`;
const StyledArrowContainerLeft = styled.div`
  font-size: 35px;
  width: 50px;
  height: 50px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
  background: #ffff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  border-radius: 50%;
  left: 0;
  :hover {
    background: gray;
    color: #ffff;
  }
  cursor: pointer;
  z-index: 1;

  @media only screen and (max-width: 550px) {
    display: none;
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffff;
  position: relative;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
`;
/**
 * Products Component
 * Displays a horizontal scrolling list of products
 * @param {string} title - The title to display for the product section
 * @param {string} endPoint - The API endpoint to fetch products from (relative to baseUrl/api/v1/)
 */
const Products = ({ title, endPoint}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = sliderRef.current.scrollLeft - 500;
    }
  };
  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = sliderRef.current.scrollLeft + 500;
    }
  };
  useEffect(() => {
    setLoading(true);
    const apiUrl = endPoint 
      ? `${baseUrl}api/v1/${endPoint}`
      : `${baseUrl}api/v1/products/best-selling`;
    
    axios({
      method: 'GET',
      url: apiUrl,
    })
      .then((res) => {
        // Handle different response structures
        const responseData = res.data?.data || res.data || [];
        const products = Array.isArray(responseData) ? responseData : [];
        
        // Transform data to ensure consistent structure
        const transformedProducts = products.map((product) => ({
          id: product.id || product._id,
          image: product.image || product.thumbnail || product.images?.[0] || '',
          price: product.price || product.unit_price || 0,
          description: product.description || product.name || product.title || '',
          rating: product.rating || product.rating_count || 0,
          ...product, // Keep all original properties
        }));
        
        setData(transformedProducts);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load products');
        setData([]);
        setLoading(false);
      });

    return () => {
      // Cleanup if needed
    };
  }, [endPoint]);

  return (
    <Container>
      <Head>
        <span>
          <h3>{title}</h3>
          <span className="Home__flash--buttons">
            <p>811</p> : <p>11</p> : <p>11</p> : <p>11</p>
          </span>
        </span>
        <button>View More</button>
      </Head>
      <div 
        ref={sliderRef} 
        style={{ display: 'flex', overflowX: 'auto', gap: '10px', scrollBehavior: 'smooth' }}
        role="region"
        aria-label={`${title} products carousel`}
      >
        <StyledArrowContainerLeft 
          onClick={slideLeft}
          aria-label="Scroll products left"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && slideLeft()}
        >
          <MdKeyboardArrowLeft />
        </StyledArrowContainerLeft>
        {loading ? (
          <Spinner />
        ) : error ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
            {error}
          </div>
        ) : data && data.length > 0 ? (
          data.map((values) => {
            return <Product product={values} key={values.id || values._id} />;
          })
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No products available at the moment
          </div>
        )}
        <StyledArrowContainerRight 
          onClick={slideRight}
          aria-label="Scroll products right"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && slideRight()}
        >
          <MdKeyboardArrowRight />
        </StyledArrowContainerRight>
      </div>
    </Container>
  );
};

export default Products;
