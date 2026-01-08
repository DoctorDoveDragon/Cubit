'use client'

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Customize</h1>
          <p className="text-gray-400">
            Customize your Cubit experience (Coming Soon)
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-12 text-center">
          <svg className="w-24 h-24 mx-auto mb-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Customization Features Coming Soon</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            This page will allow you to customize themes, preferences, and settings for the Cubit Intelligent GUI.
            Stay tuned for updates in future releases.
          </p>
        </div>
      </div>
    </div>
  )
}
