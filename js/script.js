function addComment(commentId, textareaId) {
    // Get the new comment from the textarea
    const newComment = document.getElementById(textareaId).value;

    // If there is a new comment, append it to the existing comments
    if (newComment.trim()) {
        const commentSection = document.getElementById(commentId);
        commentSection.innerHTML += `<br>"${newComment}" - New Customer`;
        
        // Clear the textarea after adding the comment
        document.getElementById(textareaId).value = '';
    } else {
        alert('Please write a comment before submitting.');
    }
}
