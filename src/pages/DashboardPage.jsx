import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { MemeGallery } from '../components/MemeGallery';
import { CreditBalance } from '../components/CreditPackages';
import { PaymentModal } from '../components/PaymentModal';
import { useAuth } from '../hooks/useAuth';
import { getUserMemes } from '../services/memeService';
import { getPaymentHistory } from '../services/userService';
import { Loader2, Plus, History, AlertCircle } from 'lucide-react';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState('memes');
  const [memes, setMemes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { returnTo: '/dashboard' } });
    }
  }, [currentUser, navigate]);

  // Load user memes
  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Load memes
        const userMemes = await getUserMemes(currentUser.uid);
        setMemes(userMemes);
        
        // Load transaction history
        const history = await getPaymentHistory(currentUser.uid);
        setTransactions(history);
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load your data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [currentUser]);

  const handleCreateMeme = () => {
    navigate('/create');
  };

  const handlePaymentSuccess = () => {
    // Reload transaction history after successful payment
    if (currentUser) {
      getPaymentHistory(currentUser.uid)
        .then(history => setTransactions(history))
        .catch(err => console.error('Error loading transaction history:', err));
    }
  };

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="container mx-auto px-4 pb-16 pt-6">
        {/* Dashboard Header */}
        <div className="glass-card rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
              <p className="text-purple-200">
                Manage your memes and account
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {userData && (
                <CreditBalance credits={userData.credits || 0} className="glass-card p-3 rounded-lg" />
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-accent/20 hover:bg-accent/30 text-accent px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Buy Credits
                </button>
                
                <button
                  onClick={handleCreateMeme}
                  className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Meme</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-2 text-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {/* Tabs */}
        <div className="mb-6 border-b border-white/20">
          <div className="flex space-x-6">
            <button
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'memes'
                  ? 'border-accent text-white'
                  : 'border-transparent text-purple-200 hover:text-white'
              }`}
              onClick={() => setActiveTab('memes')}
            >
              My Memes
            </button>
            
            <button
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === 'transactions'
                  ? 'border-accent text-white'
                  : 'border-transparent text-purple-200 hover:text-white'
              }`}
              onClick={() => setActiveTab('transactions')}
            >
              Transaction History
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : (
          <>
            {/* Memes Tab */}
            {activeTab === 'memes' && (
              <div>
                {memes.length > 0 ? (
                  <MemeGallery memes={memes} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-purple-200 mb-4">You haven't created any memes yet.</p>
                    <button
                      onClick={handleCreateMeme}
                      className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Create Your First Meme
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="glass-card rounded-lg overflow-hidden">
                {transactions.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/10">
                        <th className="py-3 px-4 text-left text-white">Date</th>
                        <th className="py-3 px-4 text-left text-white">Type</th>
                        <th className="py-3 px-4 text-right text-white">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr key={index} className="border-t border-white/10">
                          <td className="py-3 px-4 text-purple-200">
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-purple-200">
                            {transaction.type === 'credit_purchase' ? 'Purchase' : 'Usage'}
                          </td>
                          <td className={`py-3 px-4 text-right ${
                            transaction.type === 'credit_purchase' 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {transaction.type === 'credit_purchase' ? '+' : '-'}
                            {transaction.amount} credits
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 text-purple-300/50 mx-auto mb-4" />
                    <p className="text-purple-200 mb-4">No transaction history yet.</p>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Buy Credits
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

