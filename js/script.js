// Object to hold the ratings and count for each dish
const ratingsData = {
    item1: { totalRatings: 0, numberOfVotes: 0 },
    item2: { totalRatings: 0, numberOfVotes: 0 },
    item3: { totalRatings: 0, numberOfVotes: 0 }
};

function addComment(commentId, textareaId) {
    const newComment = document.getElementById(textareaId).value;
    
    if (newComment.trim()) {
        const commentSection = document.getElementById(commentId);
        commentSection.innerHTML += `<br>"${newComment}" - New Customer`;
        
        // Clear the textarea after adding the comment
        document.getElementById(textareaId).value = '';
    } else {
        alert('Please write a comment before submitting.');
    }
}

function handleRating(starIdPrefix, ratingId, avgRatingId) {
    const stars = document.querySelectorAll(`#${starIdPrefix} .star`);
    const ratingDisplay = document.getElementById(ratingId);
    const avgRatingDisplay = document.getElementById(avgRatingId);
    const itemKey = starIdPrefix; // This refers to the key in ratingsData (item1, item2, etc.)

    // Set the rating when a star is clicked
    stars.forEach(star => {
        star.addEventListener('click', function () {
            const rating = parseInt(this.getAttribute('data-star'));
            stars.forEach(s => {
                if (s.getAttribute('data-star') <= rating) {
                    s.innerHTML = '&#9733;'; // Filled star
                } else {
                    s.innerHTML = '&#9734;'; // Empty star
                }
            });

            // Update the displayed rating
            ratingDisplay.innerHTML = `Rating: ${rating} stars`;

            // Update the ratings data for the item
            ratingsData[itemKey].totalRatings += rating;
            ratingsData[itemKey].numberOfVotes += 1;

            // Calculate and display the average rating
            const averageRating = (ratingsData[itemKey].totalRatings / ratingsData[itemKey].numberOfVotes).toFixed(1);
            avgRatingDisplay.innerHTML = `Average Rating: ${averageRating} stars`;
        });
    });
}

// Initialize rating systems for each item
document.addEventListener('DOMContentLoaded', () => {
    handleRating('item1', 'rating1', 'avg-rating1');
    handleRating('item2', 'rating2', 'avg-rating2');
    handleRating('item3', 'rating3', 'avg-rating3');
});
