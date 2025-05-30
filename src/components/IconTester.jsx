import React from 'react';
import { getBusinessIcon, ICON_STRATEGIES, getAllIconsForCategory, getAvailableStrategies } from '../services/iconService';

function IconTester() {
  const categories = [
    'Grocery', 'Coffee Shop', 'Florist', 'Pharmacy', 'Barber', 
    'Bookstore', 'Restaurant', 'Gas Station', 'Bank', 
    'Real Estate', 'Moving & Storage', 'Storage'
  ];

  const strategies = [
    { key: ICON_STRATEGIES.TIER_1_ONLY, name: 'Lucide Only' },
    { key: ICON_STRATEGIES.TIER_1_AND_2, name: 'Lucide + Heroicons' },
    { key: ICON_STRATEGIES.ALL_TIERS, name: 'All Libraries' },
    { key: ICON_STRATEGIES.RANDOM_TIER, name: 'Random Tier' },
    { key: ICON_STRATEGIES.EMOJI_FALLBACK, name: 'Emoji Only' }
  ];

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">🔥 ULTIMATE ICON LIBRARY TESTER 🔥</h2>
      
      {/* Strategy Comparison */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Strategy Comparison</h3>
        <div className="grid grid-cols-5 gap-4">
          {strategies.map(strategy => (
            <div key={strategy.key} className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-sm mb-3 text-center">{strategy.name}</h4>
              <div className="space-y-2">
                {categories.slice(0, 6).map(category => (
                  <div key={category} className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {getBusinessIcon(category, strategy.key, 16)}
                    </div>
                    <span className="text-xs">{category}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Icon Matrix */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Full Icon Matrix (All Libraries)</h3>
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2">Category</th>
                <th className="text-center p-2">Lucide (T1)</th>
                <th className="text-center p-2">Heroicons (T2)</th>
                <th className="text-center p-2">Phosphor (T3)</th>
                <th className="text-center p-2">Tabler (T4)</th>
                <th className="text-center p-2">Emoji</th>
                <th className="text-center p-2">Available</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => {
                const allIcons = getAllIconsForCategory(category);
                const available = getAvailableStrategies(category);
                
                return (
                  <tr key={category} className="border-t">
                    <td className="p-2 font-medium">{category}</td>
                    <td className="p-2 text-center">
                      {allIcons?.tier1 ? (
                        <div className="flex justify-center">{allIcons.tier1}</div>
                      ) : (
                        <span className="text-gray-400">✗</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {allIcons?.tier2 ? (
                        <div className="flex justify-center">{allIcons.tier2}</div>
                      ) : (
                        <span className="text-gray-400">✗</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {allIcons?.tier3 ? (
                        <div className="flex justify-center">{allIcons.tier3}</div>
                      ) : (
                        <span className="text-gray-400">✗</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {allIcons?.tier4 ? (
                        <div className="flex justify-center">{allIcons.tier4}</div>
                      ) : (
                        <span className="text-gray-400">✗</span>
                      )}
                    </td>
                    <td className="p-2 text-center text-lg">{allIcons?.emoji}</td>
                    <td className="p-2 text-center text-xs">
                      {available.filter(s => s !== 'emoji').length}/4 libraries
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Test Area */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Live Test Area - Refresh to see random strategy</h3>
        <div className="grid grid-cols-6 gap-4">
          {categories.map(category => (
            <div key={category} className="bg-white p-4 rounded-lg shadow text-center">
              <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                {getBusinessIcon(category, ICON_STRATEGIES.RANDOM_TIER)}
              </div>
              <div className="text-xs font-medium">{category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IconTester;