


const SpotReviews = ({reviews}) => {
    const getDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long'
        }
        const formatedDate = date.toLocaleString('en-US', options)
        return formatedDate;
    } 

    return (
        <div className="reviews-continer">
            {reviews.map(review => (
                <div className="review" key={review.id}>
                    <h4>{review.User.firstName}</h4>
                    <h5>{getDate(review.createdAt)}</h5>
                    <p>{review.review}</p>
                </div>
            ))}
        </div>
    )
}

export default SpotReviews;