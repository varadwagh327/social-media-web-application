/**
 * API Integration Test Suite
 * Tests all frontend-backend API connections
 */

import { loginAPI, signupAPI, getCurrentUserAPI } from '@/lib/api/auth';
import {
  fetchPostsAPI,
  createPostAPI,
  deletePostAPI,
  likePostAPI,
  getCommentsAPI,
  addCommentAPI,
} from '@/lib/api/posts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Test Data
 */
const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  username: 'testuser',
  fullName: 'Test User',
};

/**
 * Auth API Tests
 */
export async function testAuthAPIs() {
  console.log('🧪 Testing Auth APIs...\n');

  try {
    // Test 1: Signup
    console.log('1️⃣ Testing Signup API...');
    const signupResponse = await signupAPI({
      username: testUser.username,
      email: testUser.email,
      password: testUser.password,
      fullName: testUser.fullName,
    });
    console.log('✅ Signup successful:', signupResponse);

    // Test 2: Login
    console.log('\n2️⃣ Testing Login API...');
    const loginResponse = await loginAPI({
      email: testUser.email,
      password: testUser.password,
    });
    console.log('✅ Login successful:', loginResponse);

    // Test 3: Get Current User
    console.log('\n3️⃣ Testing Get Current User API...');
    const userResponse = await getCurrentUserAPI();
    console.log('✅ Got current user:', userResponse);

    return { success: true, data: { signupResponse, loginResponse, userResponse } };
  } catch (error: any) {
    console.error('❌ Auth API tests failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Post API Tests
 */
export async function testPostAPIs() {
  console.log('\n🧪 Testing Post APIs...\n');

  try {
    // Test 1: Fetch Posts
    console.log('1️⃣ Testing Fetch Posts API...');
    const postsResponse = await fetchPostsAPI(1, 20);
    console.log('✅ Fetched posts:', postsResponse);

    // Test 2: Create Post (requires authentication)
    console.log('\n2️⃣ Testing Create Post API...');
    const formData = new FormData();
    formData.append('title', 'Test Post');
    formData.append('description', 'This is a test post');
    formData.append('visibility', 'public');

    const createResponse = await createPostAPI(formData);
    console.log('✅ Created post:', createResponse);

    // Test 3: Get Comments
    if (createResponse._id) {
      console.log('\n3️⃣ Testing Get Comments API...');
      const commentsResponse = await getCommentsAPI(createResponse._id, 1);
      console.log('✅ Fetched comments:', commentsResponse);

      // Test 4: Add Comment
      console.log('\n4️⃣ Testing Add Comment API...');
      const commentResponse = await addCommentAPI(createResponse._id, 'This is a test comment');
      console.log('✅ Added comment:', commentResponse);

      // Test 5: Like Post
      console.log('\n5️⃣ Testing Like Post API...');
      const likeResponse = await likePostAPI(createResponse._id);
      console.log('✅ Liked post:', likeResponse);

      // Test 6: Delete Post
      console.log('\n6️⃣ Testing Delete Post API...');
      const deleteResponse = await deletePostAPI(createResponse._id);
      console.log('✅ Deleted post:', deleteResponse);
    }

    return { success: true, data: { postsResponse, createResponse } };
  } catch (error: any) {
    console.error('❌ Post API tests failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * API Health Check
 */
export async function checkAPIHealth() {
  console.log(`🏥 Checking API Health at ${API_BASE_URL}...\n`);

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API is healthy:', data);
      return true;
    } else {
      console.error('❌ API health check failed:', response.statusText);
      return false;
    }
  } catch (error: any) {
    console.error('❌ Could not reach API:', error.message);
    return false;
  }
}

/**
 * Run All Tests
 */
export async function runAllTests() {
  console.log('========================================');
  console.log('🚀 Frontend-Backend API Integration Tests');
  console.log('========================================\n');

  // Check API health first
  const isHealthy = await checkAPIHealth();
  if (!isHealthy) {
    console.log('\n⚠️ API is not healthy. Skipping other tests.');
    return;
  }

  // Run auth tests
  const authResults = await testAuthAPIs();

  // Run post tests (if auth was successful)
  if (authResults.success) {
    const postResults = await testPostAPIs();
  }

  console.log('\n========================================');
  console.log('✅ All Tests Completed');
  console.log('========================================\n');
}

export default runAllTests;
