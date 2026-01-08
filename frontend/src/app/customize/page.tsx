'use client'

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Customize</h1>
          <p className="text-gray-400">
            Personalization and configuration options coming soon
          </p>
        </header>

        <div className="bg-gray-900 rounded-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold mb-4">Customization Hub</h2>
            <p className="text-gray-400 mb-6">
              This page will allow you to customize the Cubit IDE experience with:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Theme and color scheme customization</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Editor preferences and keybindings</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Teaching mode verbosity settings</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Dashboard layout customization</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Notification and alert preferences</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
