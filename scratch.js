document.addEventListener("DOMContentLoaded", () => {
    const bubbles = document.querySelectorAll(".bubble");

    // Function to generate random speed
    const getRandomSpeed = () => (Math.random() - 0.5) * 2;

    // Function to set bubble initial positions randomly within the container, ensuring no overlap
    const setInitialPosition = (bubble, bubbles) => {
        let parentRect = bubble.parentElement.getBoundingClientRect();
        let bubbleSize = bubble.offsetWidth;
        let newX, newY;
        let overlap = true;

        // Try random positions until no overlap
        while (overlap) {
            overlap = false;
            newX = Math.random() * (parentRect.width - bubbleSize);
            newY = Math.random() * (parentRect.height - bubbleSize);

            // Check if the new position overlaps with any other bubble
            for (let otherBubble of bubbles) {
                if (otherBubble !== bubble) {
                    let otherBubbleRect = otherBubble.getBoundingClientRect();
                    let dx = newX - otherBubbleRect.left;
                    let dy = newY - otherBubbleRect.top;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < (bubbleSize + otherBubble.offsetWidth) / 2) {
                        overlap = true; // Set overlap to true if there is a collision
                        break; // Exit the loop and try a new random position
                    }
                }
            }
        }

        bubble.style.left = `${newX}px`;
        bubble.style.top = `${newY}px`;
    };

    bubbles.forEach(bubble => {
        // Set random speed for each bubble
        let speedX = getRandomSpeed();
        let speedY = getRandomSpeed();

        // Set initial position for each bubble, ensuring no overlap
        setInitialPosition(bubble, bubbles);

        function moveBubble() {
            // Get current position of the bubble and the container
            let bubbleRect = bubble.getBoundingClientRect();
            let parentRect = bubble.parentElement.getBoundingClientRect();

            // Calculate new position based on speed
            let newX = bubbleRect.left + speedX;
            let newY = bubbleRect.top + speedY;

            // Check if the bubble hits the left or right of the container and reverse its direction
            if (newX <= parentRect.left || newX + bubbleRect.width >= parentRect.right) {
                speedX *= -1; // Reverse horizontal direction
            }

            // Check if the bubble hits the top or bottom of the container and reverse its direction
            if (newY <= parentRect.top || newY + bubbleRect.height >= parentRect.bottom) {
                speedY *= -1; // Reverse vertical direction
            }

            // Bounce off other bubbles
            bubbles.forEach(otherBubble => {
                if (otherBubble !== bubble) {
                    let otherBubbleRect = otherBubble.getBoundingClientRect();
                    let dx = (newX + bubbleRect.width / 2) - (otherBubbleRect.left + otherBubbleRect.width / 2);
                    let dy = (newY + bubbleRect.height / 2) - (otherBubbleRect.top + otherBubbleRect.height / 2);
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    // Check if bubbles are colliding (threshold can be adjusted)
                    if (distance < (bubbleRect.width / 2 + otherBubbleRect.width / 2)) {
                        // Reverse the direction of both bubbles upon collision
                        speedX *= -1;
                        speedY *= -1;
                    }
                }
            });

            // Set the new position directly using left and top
            newX = Math.max(parentRect.left, Math.min(newX, parentRect.right - bubbleRect.width));
            newY = Math.max(parentRect.top, Math.min(newY, parentRect.bottom - bubbleRect.height));

            // Apply the new position directly
            bubble.style.left = `${newX - parentRect.left}px`;
            bubble.style.top = `${newY - parentRect.top}px`;

            // Continue animating the bubbles
            requestAnimationFrame(moveBubble);
        }

        moveBubble();
    });
});
