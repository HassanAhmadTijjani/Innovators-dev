function StarDisplay({ rating, size = 'sm' }) {
    const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' }
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <span key={star}
                    className={`${sizes[size]}
                  ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`}>
                    ★
                </span>
            ))}
        </div>
    )
}

export default StarDisplay