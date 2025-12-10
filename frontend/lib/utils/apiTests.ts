

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

const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  username: 'testuser',
  fullName: 'Test User',
};

export async function testAuthAPIs() {
  console.log('🧪 Testing Auth APIs...\n');

  try {
    console.log('1️⃣ Testing Signup API...');
    const signupResponse = await signupAPI({
      username: testUser.username,
      email: testUser.email,
      password: testUser.password,
      fullName: testUser.fullName,
    });
    console.log('✅ Signup successful:', signupResponse);

    console.log('\n2️⃣ Testing Login API...');
    const loginResponse = await loginAPI({
      email: testUser.email,
      password: testUser.password,
    });
    console.log('Login successful:', loginResponse);

    console.log('\nTesting Get Current User API...');
    const userResponse = await getCurrentUserAPI();
    console.log(' Got current user:', userResponse);

    return { success: true, data: { signupResponse, loginResponse, userResponse } };
  } catch (error: any) {
    console.error(' Auth API tests failed:', error.message);
    return { success: false, error: error.message };
  }
}

export async function testPostAPIs() {
  console.log('\nTesting Post APIs...\n');

  try {
    console.log(' Testing Fetch Posts API...');
    const postsResponse = await fetchPostsAPI(1, 20);
    console.log('Fetched posts:', postsResponse);

    console.log('\n Testing Create Post API...');
    const formData = new FormData();
    formData.append('title', 'Test Post');
    formData.append('description', 'This is a test post');
    formData.append('visibility', 'public');

    const createResponse = await createPostAPI(formData);
    console.log('Created post:', createResponse);

    if (createResponse._id) {
      console.log('\nTesting Get Comments API...');
      const commentsResponse = await getCommentsAPI(createResponse._id, 1);
      console.log(' Fetched comments:', commentsResponse);

      console.log('\n Testing Add Comment API...');
      const commentResponse = await addCommentAPI(createResponse._id, 'This is a test comment');
      console.log(' Added comment:', commentResponse);

      console.log('\n Testing Like Post API...');
      const likeResponse = await likePostAPI(createResponse._id);
      console.log(' Liked post:', likeResponse);

      console.log('\n Testing Delete Post API...');
      const deleteResponse = await deletePostAPI(createResponse._id);
      console.log(' Deleted post:', deleteResponse);
    }

    return { success: true, data: { postsResponse, createResponse } };
  } catch (error: any) {
    console.error('❌ Post API tests failed:', error.message);
    return { success: false, error: error.message };
  }
}

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
      console.log(' API is healthy:', data);
      return true;
    } else {
      console.error(' API health check failed:', response.statusText);
      return false;
    }
  } catch (error: any) {
    console.error(' Could not reach API:', error.message);
    return false;
  }
}

/**
 * Run All Tests
 */
export async function runAllTests() {
  console.log('========================================');
  console.log(' Frontend-Backend API Integration Tests');
  console.log('========================================\n');

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
