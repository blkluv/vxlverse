import React, { useState } from "react";
import { X } from "lucide-react";

interface TermsOfServiceProps {
  onAccept: () => void;
  onClose: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onAccept, onClose }) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-md max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Terms of Service</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow text-slate-300 text-sm space-y-4">
          <h3 className="text-lg font-semibold text-white">
            1. Content Ownership & Responsibility
          </h3>
          <p>
            By using VXLVerse, you acknowledge and agree that you are solely responsible for all
            content (including images, models, and other media) that you upload, share, or otherwise
            make available through the service.
          </p>
          <p>
            <strong>You represent and warrant that:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              You own or have obtained all necessary rights, licenses, consents, and permissions to
              use and authorize VXLVerse to use your content.
            </li>
            <li>
              Your content does not and will not infringe, violate, or misappropriate any
              third-party right, including any copyright, trademark, patent, trade secret, moral
              right, privacy right, right of publicity, or any other intellectual property or
              proprietary right.
            </li>
            <li>
              You are solely responsible for your content and the consequences of posting or
              publishing it.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6">2. Prohibited Content</h3>
          <p>VXLVerse strictly prohibits the upload, sharing, or display of content that:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Contains explicit nudity, pornography, or sexually explicit material</li>
            <li>Depicts violence, gore, or graphic content</li>
            <li>
              Promotes hatred, discrimination, or harassment based on race, gender, religion,
              nationality, disability, sexual orientation, or age
            </li>
            <li>Infringes on intellectual property rights of others</li>
            <li>Contains malware, viruses, or other harmful code</li>
            <li>Violates any applicable law or regulation</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6">3. Content Moderation</h3>
          <p>
            VXLVerse reserves the right, but not the obligation, to review, monitor, and remove any
            content that violates these terms. We may take appropriate action against users who
            violate our terms, including removing content, suspending or terminating accounts, and
            reporting to law enforcement authorities when necessary.
          </p>

          <h3 className="text-lg font-semibold text-white mt-6">4. Disclaimer of Warranties</h3>
          <p>
            VXLVerse is provided "as is" and "as available" without any warranties of any kind,
            either express or implied. We do not guarantee that the service will be uninterrupted,
            secure, or error-free. You use the service at your own risk.
          </p>

          <h3 className="text-lg font-semibold text-white mt-6">5. Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, VXLVerse and its affiliates shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages, or any loss
            of profits or revenues, whether incurred directly or indirectly, or any loss of data,
            use, goodwill, or other intangible losses resulting from your use of the service.
          </p>

          <h3 className="text-lg font-semibold text-white mt-6">6. Changes to Terms</h3>
          <p>
            We may modify these terms at any time. If we make material changes, we will notify you
            through the service or by other means. Your continued use of VXLVerse after such
            notification constitutes your acceptance of the updated terms.
          </p>
        </div>

        <div className="p-4 border-t border-slate-700 flex flex-col sm:flex-row items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-4 h-4 rounded border-slate-500 bg-slate-800 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-300">
              I have read and agree to the Terms of Service
            </span>
          </label>
          <button
            onClick={handleAccept}
            disabled={!accepted}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              accepted
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
