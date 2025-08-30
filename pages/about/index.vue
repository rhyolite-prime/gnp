<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Breadcrumb -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-red-600">Home</NuxtLink>
          <span class="mx-2">›</span>
          <span class="font-medium">About Us</span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <!-- Page Header -->
      <div class="mb-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">About Graphic Communications Group Limited</h1>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Company Info Column -->
          <div class="md:col-span-2 space-y-8">
            <!-- Company Overview -->
            <div class="prose max-w-none">
              <p class="text-lg">
                "Graphic Communications Group Ltd is a news publishing media organisation in Ghana established in 1950. We are known for professionalism
                in journalism and it is a virtue we jealously guard. Our publications have, therefore, gained so much credibility with readers that in Ghana,
                "Graphic" means "newspaper." Our products include:
              </p>
              <ol class="list-decimal pl-6 text-gray-700 mt-4 space-y-1">
                <li>Daily Graphic Newspaper</li>
                <li>Graphic Online News Portal</li>
                <li>Graphic Mirror Newspaper</li>
                <li>Graphic Business Newspaper</li>
                <li>Graphic Sports Newspaper</li>
                <li>Junior Graphic Newspaper</li>
                <li>Graphic Showbiz Newspaper</li>
              </ol>
            </div>

            <!-- Company Mission -->
            <div class="prose max-w-none">
              <p>
                Graphic Communications Group Ltd is a company working to empower humanity with true information and help build a global society whose
                members are well-informed and can freely express their opinions and take others' opinions as well as make informed choices because they
                have facts, whether about products, services or state policies. We do this by producing news that is well-researched, balanced and factual.
                Also, through advertising, we empower people with information on goods and services to enable them to make choices, knowing why they
                choose a particular product over others. In doing this, we make a firm commitment to infuse excellence into all that we do.
              </p>
            </div>

            <!-- Company Values -->
            <div class="prose max-w-none">
              <p>
                We hold the view that any product or service from us must exceed customers' expectations. This means we should constantly be looking for
                new ways to make our products and services more exciting without losing quality. Innovativeness is, therefore, one of the values we cherish. We
                serve news to readers through channels they prefer. Hence, we are aggressively engaged in the digitization of news in order to make it possible
                for our readers to get the news where they have shown to be their preference – the digital space.
              </p>
            </div>

            <!-- Graphic NewsPlus Info -->
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Graphic NewsPlus</h2>
              <div class="prose max-w-none">
                <p>
                  Graphic NewsPlus provides you with digital versions of Graphic Communications' six leading newspaper publications. The Daily Graphic,
                  Graphic Business, Graphic Showbiz, TheMirror, Graphic Sports and Junior Graphics.
                </p>
                <p class="mt-4">
                  Graphic NewsPlus offers readers access to both digital versions of newspapers and content from our 24-hour news website in addition to
                  breaking news alerts. The app is also packed with multimedia content such as our video documentaries, podcasts, voice notes and photo
                  galleries carefully curated to inform, entertain and educate you of the current and latest news in Ghana.
                </p>
              </div>
            </div>

            <!-- Features -->
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Features</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-14a2 2 0 10-4 0v1H5V4a1 1 0 112 0v.01H6V4a1 1 0 011-1h.01zM7 14a1 1 0 11-2 0 1 1 0 012 0zm3-10h4a1 1 0 110 2h-4a1 1 0 110-2zm0 4h4a1 1 0 110 2h-4a1 1 0 110-2zm0 4h4a1 1 0 110 2h-4a1 1 0 110-2z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <h3 class="ml-3 text-lg font-semibold text-gray-900">Digital Newspapers</h3>
                  </div>
                  <p class="text-gray-600">Read your favorite Graphic newspapers in digital format, accessible anytime and anywhere.</p>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <h3 class="ml-3 text-lg font-semibold text-gray-900">Breaking News Alerts</h3>
                  </div>
                  <p class="text-gray-600">Stay informed with real-time notifications about important news events as they happen.</p>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                    <h3 class="ml-3 text-lg font-semibold text-gray-900">Multimedia Content</h3>
                  </div>
                  <p class="text-gray-600">Enjoy videos, podcasts, and photo galleries that enhance your news experience.</p>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <h3 class="ml-3 text-lg font-semibold text-gray-900">Organized Categories</h3>
                  </div>
                  <p class="text-gray-600">Browse news by categories to quickly find content that interests you most.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div>
            <!-- Company Card -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Company Information</h3>
              <div class="space-y-3 text-gray-600">
                <div class="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p>Established in 1950</p>
                </div>
                <div class="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>
                    Graphic Road, Accra<br />
                    P.O. Box 742, Accra, Ghana
                  </p>
                </div>
                <div class="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p>+233 302 684024</p>
                </div>
                <div class="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p>info@graphic.com.gh</p>
                </div>
              </div>
            </div>

            <!-- Social Media Links -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Connect With Us</h3>
              <div class="flex justify-between">
                <a href="#" class="flex flex-col items-center">
                  <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </div>
                  <span class="text-sm mt-2 text-gray-600">Twitter</span>
                </a>
                <a href="#" class="flex flex-col items-center">
                  <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                  </div>
                  <span class="text-sm mt-2 text-gray-600">Facebook</span>
                </a>
                <a href="#" class="flex flex-col items-center">
                  <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <span class="text-sm mt-2 text-gray-600">Instagram</span>
                </a>
                <a href="#" class="flex flex-col items-center">
                  <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                  </div>
                  <span class="text-sm mt-2 text-gray-600">YouTube</span>
                </a>
              </div>
            </div>

            <!-- Publications -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Our Publications</h3>
              <div class="space-y-4">
                <a href="#" class="flex items-center hover:bg-gray-50 p-2 rounded-md transition-colors">
                  <div class="w-12 h-12 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold">DG</div>
                  <div class="ml-4">
                    <h4 class="font-semibold text-gray-900">Daily Graphic</h4>
                    <p class="text-sm text-gray-600">Ghana's most trusted newspaper</p>
                  </div>
                </a>
                <a href="#" class="flex items-center hover:bg-gray-50 p-2 rounded-md transition-colors">
                  <div class="w-12 h-12 bg-orange-100 rounded flex items-center justify-center text-orange-600 font-bold">GB</div>
                  <div class="ml-4">
                    <h4 class="font-semibold text-gray-900">Graphic Business</h4>
                    <p class="text-sm text-gray-600">Business news and analysis</p>
                  </div>
                </a>
                <a href="#" class="flex items-center hover:bg-gray-50 p-2 rounded-md transition-colors">
                  <div class="w-12 h-12 bg-green-100 rounded flex items-center justify-center text-green-600 font-bold">GS</div>
                  <div class="ml-4">
                    <h4 class="font-semibold text-gray-900">Graphic Sports</h4>
                    <p class="text-sm text-gray-600">Comprehensive sports coverage</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      <!-- Contact CTA -->
      <div class="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg p-8 text-white">
        <div class="md:flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-4">Have a suggestion for us?</h2>
            <p class="mb-6 max-w-2xl">
              We value your feedback and ideas! If you have any suggestions on how we can improve our platform, publications, or services, please let us know. Your input helps us serve you better.
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <NuxtLink
              to="/contact"
              class="inline-block bg-white text-red-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Send a Suggestion
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
useHead({
  title: 'About Us - Graphic NewsPlus',
  meta: [
    { name: 'description', content: 'Learn about Graphic Communications Group Limited, Ghana\'s premier news organization since 1950, and our digital news platform, Graphic NewsPlus.' }
  ]
})
</script>

<style scoped>
/* Add any additional page-specific styles here */
</style>
