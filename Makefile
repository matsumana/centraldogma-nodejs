.PHONY: docker-compose-up
docker-compose-up:
	docker-compose up -d

.PHONY: docker-compose-down
docker-compose-down:
	docker-compose down

.PHONY: setup-test-data
setup-test-data:
	# project1
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project1.json \
	  http://localhost:36462/api/v1/projects
	# project1 - repo1
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project1_repo1.json \
	  http://localhost:36462/api/v1/projects/project1/repos
	# project1 - repo1 - content1
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project1_repo1_content1.json \
	  http://localhost:36462/api/v0/projects/project1/repositories/repo1/files/revisions/head
	# project1 - repo1 - content2
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project1_repo1_content2.json \
	  http://localhost:36462/api/v0/projects/project1/repositories/repo1/files/revisions/head
	# project1 - repo2
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project1_repo2.json \
	  http://localhost:36462/api/v1/projects/project1/repos
	# project1 - repo2 - content1
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project1_repo2_content1.json \
  	  http://localhost:36462/api/v0/projects/project1/repositories/repo2/files/revisions/head
	# project1 - repo2 - content2
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project1_repo2_content2.json \
  	  http://localhost:36462/api/v0/projects/project1/repositories/repo2/files/revisions/head
	# project1 - repo2 - content3
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project1_repo2_content3.json \
  	  http://localhost:36462/api/v0/projects/project1/repositories/repo2/files/revisions/head
	# ----------
	# project2
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project2.json \
	  http://localhost:36462/api/v1/projects
	# project2 - repo1
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project2_repo1.json \
	  http://localhost:36462/api/v1/projects/project2/repos
	# project2 - repo1 - content1
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project2_repo1_content1.json \
  	  http://localhost:36462/api/v0/projects/project2/repositories/repo1/files/revisions/head
	# project2 - repo2
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project2_repo2.json \
	  http://localhost:36462/api/v1/projects/project2/repos
	# project2 - repo2 - content1
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project2_repo2_content1.json \
  	  http://localhost:36462/api/v0/projects/project2/repositories/repo2/files/revisions/head
	# project2 - repo2 - content2
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project2_repo2_content2.json \
  	  http://localhost:36462/api/v0/projects/project2/repositories/repo2/files/revisions/head
	# ----------
	# project3
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project3.json \
	  http://localhost:36462/api/v1/projects
	# ----------
	# project4
	curl -X POST \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project4.json \
	  http://localhost:36462/api/v1/projects

.PHONY: update-test-data
update-test-data:
	curl -X PUT \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project2_repo2_content2_update1.json \
	  http://localhost:36462/api/v0/projects/project2/repositories/repo2/files/revisions/head
	sleep 3
	curl -X PUT \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project2_repo2_content2_update2.json \
	  http://localhost:36462/api/v0/projects/project2/repositories/repo2/files/revisions/head
	sleep 3
	curl -X PUT \
	  -H 'Authorization: Bearer anonymous' \
	  -H 'Content-Type: application/json' \
	  -d @test/data/project2_repo2_content2_update3.json \
	  http://localhost:36462/api/v0/projects/project2/repositories/repo2/files/revisions/head

.PHONY: clean-build
clean-build:
	yarn clean && yarn fix && yarn lint && yarn test && yarn build
