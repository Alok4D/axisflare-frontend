
import DefaultPricing from "./_components/DefaultPricing";

const DefaultPage = () => {
    return (
        <div className="relative w-full max-w-4xl mx-auto min-h-screen py-20 flex flex-col items-center">
            {/* Fixed Background Image */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <img 
                    src="/defaultpage.png" 
                    alt="Background" 
                    className="w-full h-full object-cover" 
                />
                {/* Background overlay is now invisible and doesn't block clicks */}
                <div className="absolute inset-0"></div>
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
                <DefaultPricing />
            </div>
        </div>
    );
};

export default DefaultPage;