const ProductRating = ({ rating }) => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Create an empty array (5 items) */}
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          style={{
            fontSize: '.8rem',
            color: index < rating ? 'gold' : 'gray',
            /*
            If Index is less than Rating, color is Gold
            Iterate one by one
            Sample

            If Rating is 5/5
            Index (4) < Rating (5)
            Gold Gold Gold Gold Gold

            If Rating is 3/5
            Index (2) < Rating (3)
            Gold Gold Gold Gray Gray

            */
            marginRight: '4px',
          }}
        >
          &#9733;
          {/* Star Icon code */}
        </span>
      ))}
    </div>
  );
};

export default ProductRating;
