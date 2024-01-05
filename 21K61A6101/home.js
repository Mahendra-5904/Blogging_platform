    const readButtons = document.querySelectorAll(".btn.dark");

        // Add click event listeners to toggle visibility of blog overview
        readButtons.forEach(button => {
            button.addEventListener("click", function() {
                const blogCard = button.closest(".blog-card");
                const blogOverview = blogCard.querySelector(".blog-overview");
                blogOverview.classList.toggle("visible");
            });
        });
        