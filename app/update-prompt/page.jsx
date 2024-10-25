'use client'

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Form from "@components/Form";

const EditPrompt = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const promptId = searchParams.get("id");

	const [submitting, setSubmitting] = useState(false);
	const [post, setPost] = useState({
		prompt: "",
		tag: "",
	});

	useEffect(() => {
		const getPromptDetails = async () => {
			if (!promptId) return;

			try {
				console.log(promptId);
				const response = await fetch(`/api/prompt/${promptId}`);
				if (!response.ok) throw new Error("Failed to fetch prompt details");

				const data = await response.json();
				setPost({
					prompt: data.prompt,
					tag: data.tag,
				});
			} catch (error) {
				console.error("Error fetching prompt details:", error);
			}
		};

		getPromptDetails();
	}, [promptId]);

	const updatePrompt = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		if (!promptId) {
			alert("Prompt ID not found");
			setSubmitting(false);
			return;
		}

		try {
			const response = await fetch(`/api/prompt/${promptId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					prompt: post.prompt,
					tag: post.tag,
				}),
			});

			if (response.ok) {
				router.push("/");
			} else {
				console.error("Failed to update prompt");
			}
		} catch (error) {
			console.error("Error updating prompt:", error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Form
				type="Edit"
				post={post}
				setPost={setPost}
				submitting={submitting}
				handleSubmitting={updatePrompt}
			/>
		</Suspense>
	);
};

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<EditPrompt />
		</Suspense>
	);
}
