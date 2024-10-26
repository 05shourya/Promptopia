'use client'

import { useEffect, useState } from "react"
import PromptCard from "./PromptCard"

const PromptCardList = ({ data, handleTagClick }) => {
	return (
		<div className="mt-16 prompt_layout">
			{data.map((post) => (
				<PromptCard
					key={post._id}
					post={post}
					handleTagClick={handleTagClick}
				/>
			))}
		</div>
	)
}

const Feed = () => {
	const [searchText, setSearchText] = useState('')
	const [posts, setPosts] = useState([])
	const [filteredPosts, setFilteredPosts] = useState([])

	const handleSearchChange = (e) => {
		const searchValue = e.target.value
		setSearchText(searchValue)

		// Filter posts based on search value
		const filtered = posts.filter((post) => {
			const { username, email } = post.creator
			const { tag, prompt } = post
			return (
				username.toLowerCase().includes(searchValue.toLowerCase()) ||
				email.toLowerCase().includes(searchValue.toLowerCase()) ||
				tag.toLowerCase().includes(searchValue.toLowerCase()) ||
				prompt.toLowerCase().includes(searchValue.toLowerCase())
			)
		})

		setFilteredPosts(filtered)
	}

	useEffect(() => {
		const fetchPosts = async () => {
			const response = await fetch('/api/prompt')
			const data = await response.json()
			setPosts(data)
			setFilteredPosts(data) // Set initially loaded posts as filtered posts
		}
		fetchPosts()
	}, [])

	return (
		<section className="feed">
			<form className="relative w-full flex-center">
				<input
					type="text"
					placeholder="Search"
					value={searchText}
					onChange={handleSearchChange}
					className="search_input peer"
				/>
			</form>
			<PromptCardList data={filteredPosts} handleTagClick={() => { }} />
		</section>
	)
}

export default Feed
