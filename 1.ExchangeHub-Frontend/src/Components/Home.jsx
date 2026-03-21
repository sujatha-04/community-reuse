import "./Home.css"

const Home=()=>{
    return(<>
        <main>
            <h2 id="home-head">Welcome To Home Page</h2>
            <div id="para-div1">
               <p>The Community Reuse & Exchange Hub is a web-based platform designed to encourage neighborhood item sharing and reuse 
                 of unused goods.</p>
                <p>Instead of discarding items that are no longer needed, users can share, exchange, or request items within their local 
                    community, promoting sustainability and reducing waste.</p>
            </div>

            {/* About Service Section */}
            <section id="about-service-section">
                <h2 id="about-service-title">📖 About Our Service</h2>
                <div className="about-service-content">
                    <div className="about-box">
                        <h3>🌱 Promote Sustainability</h3>
                        <p>Many useful items are often left unused or discarded, leading to unnecessary waste. Our platform provides a simple solution by connecting people who have items they no longer need with those who are looking for them.</p>
                    </div>
                    <div className="about-box">
                        <h3>🤝 Build Community</h3>
                        <p>Users can easily register, list items they wish to give away, and explore items shared by others. The system allows users to request items, making the exchange process smooth and convenient. Our admin approval mechanism ensures all users are verified, maintaining a safe and trustworthy environment.</p>
                    </div>
                    <div className="about-box">
                        <h3>♻️ Make an Impact</h3>
                        <p>The main objective of our platform is to reduce waste and encourage responsible consumption while building a supportive community. By making reuse easy and accessible, the Community Reuse & Exchange Hub contributes to both environmental protection and social well-being.</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features-section">
                <h2 id="features-title">✨ Features</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">👤</div>
                        <h3>User Registration & Login</h3>
                        <p>Secure access for all users</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📦</div>
                        <h3>Item Listing</h3>
                        <p>Users can upload items they want to share</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Request System</h3>
                        <p>Users can request available items</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">✅</div>
                        <h3>Admin Approval</h3>
                        <p>Admin verifies users for safety</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🌍</div>
                        <h3>Community Focus</h3>
                        <p>Encourages local sharing and reuse</p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq-section">
                <h2 id="faq-title">❓ Frequently Asked Questions</h2>
                <div className="faq-container">
                    <div className="faq-item">
                        <div className="faq-question">What is this platform used for?</div>
                        <div className="faq-answer">This platform allows users to share and exchange unused items within their community.</div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question">Is it free to use?</div>
                        <div className="faq-answer">Yes, the platform is completely free for all users.</div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question">How can I list an item?</div>
                        <div className="faq-answer">After logging in, you can add item details through the "Manage Items" section.</div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question">Why is user approval required?</div>
                        <div className="faq-answer">User approval ensures safety and prevents misuse of the platform.</div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question">Can I request items from others?</div>
                        <div className="faq-answer">Yes, users can browse available items and send requests.</div>
                    </div>
                    <div className="faq-item">
                        <div className="faq-question">What kind of items can be shared?</div>
                        <div className="faq-answer">Books, clothes, electronics, and other reusable items.</div>
                    </div>
                </div>
            </section>
        </main>
        <footer>
             <h4>2025@ ALL RIGHTS RESERVED TO BATCH-10_CREH</h4>
        </footer>
    </>)
}
export default Home